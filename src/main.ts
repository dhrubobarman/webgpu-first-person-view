import { App } from '@/control/app';
import { createElement } from '@/utils/createElement';
import './style.scss';

const container = createElement('div', {
  id: 'container',
  className: 'min-h-screen flex items-center justify-center'
});

const canvas = createElement(
  'canvas',
  {
    id: 'webgpu-canvas',
    width: 640,
    height: 480
  },
  container
);

async function main() {
  const app = new App(canvas);
  app.init().then(() => app.run());
}

document.addEventListener('DOMContentLoaded', main);
