import { Triangle } from '@/model/Triangle';
import { Camera } from '@/model/Camera';
import { vec3 } from 'gl-matrix';

export class Scene {
  triangles: Triangle[];
  player: Camera;

  constructor() {
    this.triangles = [];
    this.triangles.push(new Triangle([2, 0, 0], 0));
    this.player = new Camera([-2, 0, 0.5], 0, 0);
  }

  update() {
    this.triangles.forEach((triangle) => triangle.update());
    this.player.update();
  }

  spinPlayer(dX: number, dY: number) {
    this.player.eulers[2] -= dX;
    this.player.eulers[2] %= 360;

    this.player.eulers[1] = Math.min(89, Math.max(-89, this.player.eulers[1] + dY));
  }

  movePlayer(forwards: number, right: number) {
    vec3.scaleAndAdd(this.player.position, this.player.position, this.player.forwards, forwards);
    vec3.scaleAndAdd(this.player.position, this.player.position, this.player.right, right);
  }

  getPlayer() {
    return this.player;
  }
  getTriangles() {
    return this.triangles;
  }
}
