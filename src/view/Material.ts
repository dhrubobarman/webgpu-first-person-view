export class Material {
  texture!: GPUTexture;
  view!: GPUTextureView;
  sampler!: GPUSampler;
  device!: GPUDevice;

  // constructor(device: GPUDevice, url: string) {
  //   this.init(device, url);
  // }

  async init(device: GPUDevice, url: string) {
    this.device = device;
    const imageData = await this.createImageBitmapFromURL(url);
    await this.loadImageBitmap(imageData);

    const viewDescriptor: GPUTextureViewDescriptor = {
      format: 'rgba8unorm',
      dimension: '2d',
      aspect: 'all',
      baseMipLevel: 0,
      mipLevelCount: 1,
      baseArrayLayer: 0,
      arrayLayerCount: 1
    };
    this.view = this.texture.createView(viewDescriptor);

    const samplerDescriptor: GPUSamplerDescriptor = {
      addressModeU: 'repeat',
      addressModeV: 'repeat',
      magFilter: 'linear',
      minFilter: 'nearest',
      mipmapFilter: 'linear'
    };
    this.sampler = device.createSampler(samplerDescriptor);
  }

  async createImageBitmapFromURL(url: string): Promise<ImageBitmap> {
    const response = await fetch(url);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    return imageBitmap;
  }

  async loadImageBitmap(imageData: ImageBitmap) {
    const textureDescriptor: GPUTextureDescriptor = {
      size: { width: imageData.width, height: imageData.height },
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    };
    this.texture = this.device.createTexture(textureDescriptor);
    this.device.queue.copyExternalImageToTexture({ source: imageData }, { texture: this.texture }, textureDescriptor.size);
  }
}
