import vertex from '@/view/shaders/vertex.wgsl?raw';
import fragment from '@/view/shaders/fragment.wgsl?raw';
import { TriangleMesh } from '@/view/TriangleMesh';
import { mat4 } from 'gl-matrix';
import { Material } from '@/view/Material';
import chatImage from '@/assets/chat.jpg';
import { Camera } from '@/model/Camera';
import { Triangle } from '@/model/Triangle';

export class Renderer {
  canvas: HTMLCanvasElement;
  // Device/Context objects
  adapter!: GPUAdapter;
  device!: GPUDevice;
  context!: GPUCanvasContext;
  format!: GPUTextureFormat;

  // Pipeline objects
  uniformBuffer!: GPUBuffer;
  bindGroup!: GPUBindGroup;
  pipeline!: GPURenderPipeline;

  // Assets
  triangleMesh!: TriangleMesh;
  material!: Material;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  async init() {
    await this.setupDevice();
    await this.createAssets();
    await this.makePipeline();
  }

  async setupDevice() {
    this.adapter = <GPUAdapter>await navigator.gpu.requestAdapter();
    this.device = await this.adapter.requestDevice();
    this.context = <GPUCanvasContext>this.canvas.getContext('webgpu');
    this.format = navigator.gpu.getPreferredCanvasFormat();
    this.context.configure({
      device: this.device,
      format: this.format,
      alphaMode: 'opaque'
    });
  }

  async makePipeline() {
    this.uniformBuffer = this.device.createBuffer({
      size: 64 * 3,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const bindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {}
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {}
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {}
        }
      ]
    });

    this.bindGroup = this.device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: { buffer: this.uniformBuffer }
        },
        {
          binding: 1,
          resource: this.material.view
        },
        {
          binding: 2,
          resource: this.material.sampler
        }
      ]
    });
    const pipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout]
    });

    this.pipeline = this.device.createRenderPipeline({
      vertex: {
        module: this.device.createShaderModule({ code: vertex }),
        entryPoint: 'vs_main',
        buffers: [this.triangleMesh.bufferLayout]
      },
      fragment: {
        module: this.device.createShaderModule({ code: fragment }),
        entryPoint: 'fs_main',
        targets: [{ format: this.format }]
      },
      primitive: { topology: 'triangle-list' },
      layout: pipelineLayout
    });
  }

  async createAssets() {
    this.triangleMesh = new TriangleMesh(this.device);
    this.material = new Material();

    await this.material.init(this.device, chatImage);
  }

  async render(camera: Camera, triangles: Triangle[]) {
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, this.canvas.width / this.canvas.height, 0.1, 10);

    const viewMatrix = camera.getView();

    this.device.queue.writeBuffer(this.uniformBuffer, 64, <ArrayBuffer>viewMatrix);
    this.device.queue.writeBuffer(this.uniformBuffer, 128, <ArrayBuffer>projectionMatrix);

    const commandEncoder = this.device.createCommandEncoder();
    const textureView = this.context.getCurrentTexture().createView();
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store'
        }
      ]
    };
    const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
    renderPass.setPipeline(this.pipeline);

    renderPass.setVertexBuffer(0, this.triangleMesh.buffer);
    triangles.forEach((triangle) => {
      const modelMatrix = triangle.getModel();
      this.device.queue.writeBuffer(this.uniformBuffer, 0, <ArrayBuffer>modelMatrix);
      renderPass.setBindGroup(0, this.bindGroup);
      renderPass.draw(3, 1, 0, 0);
    });

    renderPass.end();

    this.device.queue.submit([commandEncoder.finish()]);
  }
}
