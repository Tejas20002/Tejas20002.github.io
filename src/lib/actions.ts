export function draggable(node: HTMLElement, { active = true } = {}) {
  let x: number;
  let y: number;

  function handleMousedown(event: MouseEvent) {
    if (!active) return;
    if ((event.target as HTMLElement).closest('.window-controls')) return;
    
    x = event.clientX;
    y = event.clientY;

    node.dispatchEvent(new CustomEvent('dragstart', {
      detail: { x, y }
    }));

    window.addEventListener('mousemove', handleMousemove);
    window.addEventListener('mouseup', handleMouseup);
  }

  function handleMousemove(event: MouseEvent) {
    const dx = event.clientX - x;
    const dy = event.clientY - y;
    x = event.clientX;
    y = event.clientY;

    node.dispatchEvent(new CustomEvent('dragmove', {
      detail: { dx, dy }
    }));
  }

  function handleMouseup() {
    node.dispatchEvent(new CustomEvent('dragend'));
    window.removeEventListener('mousemove', handleMousemove);
    window.removeEventListener('mouseup', handleMouseup);
  }

  node.addEventListener('mousedown', handleMousedown);

  return {
    destroy() {
      node.removeEventListener('mousedown', handleMousedown);
    },
    update(params: { active?: boolean }) {
      active = params.active !== false;
    }
  };
}

export function resizable(node: HTMLElement, { minWidth = 200, minHeight = 150 } = {}) {
  let x: number;
  let y: number;
  let w: number;
  let h: number;
  let direction: string;

  function handleMousedown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('resizer')) return;

    direction = target.dataset.direction || '';
    x = event.clientX;
    y = event.clientY;
    w = node.offsetWidth;
    h = node.offsetHeight;

    window.addEventListener('mousemove', handleMousemove);
    window.addEventListener('mouseup', handleMouseup);
    
    event.preventDefault();
  }

  function handleMousemove(event: MouseEvent) {
    let dw = 0;
    let dh = 0;
    let dx = 0;
    let dy = 0;

    if (direction.includes('e')) dw = event.clientX - x;
    if (direction.includes('w')) {
      dw = x - event.clientX;
      dx = event.clientX - x;
    }
    if (direction.includes('s')) dh = event.clientY - y;
    if (direction.includes('n')) {
      dh = y - event.clientY;
      dy = event.clientY - y;
    }

    const nextW = Math.max(minWidth, w + dw);
    const nextH = Math.max(minHeight, h + dh);

    node.dispatchEvent(new CustomEvent('resize', {
      detail: { 
        width: nextW, 
        height: nextH,
        dx: nextW > minWidth ? dx : 0,
        dy: nextH > minHeight ? dy : 0
      }
    }));
  }

  function handleMouseup() {
    window.removeEventListener('mousemove', handleMousemove);
    window.removeEventListener('mouseup', handleMouseup);
  }

  node.addEventListener('mousedown', handleMousedown);

  return {
    destroy() {
      node.removeEventListener('mousedown', handleMousedown);
    }
  };
}
