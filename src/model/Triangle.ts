import { vec3, mat4 } from 'gl-matrix';
import { Deg2Rad } from '@/model/math';

export class Triangle {
  position: vec3;
  eulers: vec3;
  model!: mat4;

  constructor(position: vec3, theta: number) {
    this.position = position;
    this.eulers = vec3.fromValues(0, theta, 0);
  }

  update() {
    this.eulers[2] += 1;
    this.eulers[2] %= 360;

    this.model = mat4.create();
    mat4.translate(this.model, this.model, this.position);
    mat4.rotateZ(this.model, this.model, Deg2Rad(this.eulers[2]));
  }

  getModel() {
    return this.model;
  }
}
