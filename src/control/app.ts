import { Renderer } from '@/view/Renderer';
import { Scene } from '@/model/Scene';
import { createHelperElements } from '@/utils/elements';

export class App {
  canvas: HTMLCanvasElement;
  private renderer: Renderer;
  private scene: Scene;
  keyLabel: HTMLSpanElement;
  mouseXLabel: HTMLSpanElement;
  mouseYLabel: HTMLSpanElement;
  forwardAmount: number = 0;
  rideAmount: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.scene = new Scene();

    const { label, mouseXLabel, mouseYLabel } = createHelperElements();
    this.keyLabel = label;
    this.mouseXLabel = mouseXLabel;
    this.mouseYLabel = mouseYLabel;
    document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    document.addEventListener('keyup', (event) => this.handleKeyUp(event));

    this.canvas.addEventListener('click', () => this.canvas.requestPointerLock());
    this.canvas.addEventListener('mousemove', (event) => this.handleMouseMove(event));
  }

  async init() {
    await this.renderer.init();
  }

  run() {
    let running: Boolean = true;
    this.scene.update();

    this.scene.movePlayer(this.forwardAmount, this.rideAmount);

    this.renderer.render(this.scene.getPlayer(), this.scene.getTriangles());

    if (running) {
      requestAnimationFrame(() => this.run());
    }
  }

  handleMouseMove(event: MouseEvent) {
    this.mouseXLabel.textContent = (event.movementX / 5).toString();
    this.mouseYLabel.textContent = (event.movementY * -0.2).toString();

    this.scene.spinPlayer(event.movementX * 0.2, event.movementY * -0.2);
  }

  handleKeyDown(event: KeyboardEvent) {
    this.keyLabel.textContent = event.key;
    switch (event.key) {
      case 'w':
        this.forwardAmount = 0.02;
        break;
      case 's':
        this.forwardAmount = -0.02;
        break;
      case 'a':
        this.rideAmount = -0.02;
        break;
      case 'd':
        this.rideAmount = 0.02;
        break;
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    this.keyLabel.textContent = '';
    switch (event.key) {
      case 'w':
        this.forwardAmount = 0;
        break;
      case 's':
        this.forwardAmount = 0;
        break;
      case 'a':
        this.rideAmount = 0;
        break;
      case 'd':
        this.rideAmount = 0;
        break;
    }
  }
}
