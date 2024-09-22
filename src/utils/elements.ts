import { createElement } from '@/utils/createElement';

export function createHelperElements() {
  const div = createElement('div', {
    className: 'p-2 absolute border-gray-500 rounded-md border top-0 right-0 bg-gray-800 min-w-[200px]'
  });

  const currentKey = createElement(
    'h2',
    {
      className: 'mb-2 flex justify-between',
      innerHTML: 'Current key: '
    },
    false
  );
  const label = createElement(
    'span',
    {
      className: '',
      textContent: '0'
    },
    false
  );
  currentKey.appendChild(label);

  const mouseX = createElement(
    'h2',
    {
      className: 'mb-2 flex justify-between',
      innerHTML: 'Mouse x: '
    },
    false
  );
  const mouseXLabel = createElement(
    'span',
    {
      className: '',
      textContent: '0'
    },
    false
  );
  mouseX.appendChild(mouseXLabel);

  const mouseY = createElement(
    'h2',
    {
      className: 'mb-2 flex justify-between',
      innerHTML: 'Mouse y: '
    },
    false
  );
  const mouseYLabel = createElement(
    'span',
    {
      className: '',
      textContent: '0'
    },
    false
  );
  mouseY.appendChild(mouseYLabel);

  div.appendChild(currentKey);
  div.appendChild(mouseX);
  div.appendChild(mouseY);

  return {
    label,
    mouseXLabel,
    mouseYLabel
  };
}
