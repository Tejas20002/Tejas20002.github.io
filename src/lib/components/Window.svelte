<script lang="ts">
  import { draggable, resizable } from '../actions';
  import { desktop, type WindowInstance } from '../stores/desktop';

  export let win: WindowInstance;

  function handleDrag(e: CustomEvent) {
    if (win.isMaximized) return;
    desktop.updateWindow(win.id, {
      x: win.x + e.detail.dx,
      y: win.y + e.detail.dy
    });
  }

  function handleResize(e: CustomEvent) {
    desktop.updateWindow(win.id, {
      width: e.detail.width,
      height: e.detail.height,
      x: win.x + e.detail.dx,
      y: win.y + e.detail.dy
    });
  }

  function focus() {
    desktop.focusWindow(win.id);
  }
</script>

<div
  class="window"
  class:active={$desktop.activeWindowId === win.id}
  class:maximized={win.isMaximized}
  class:minimized={win.isMinimized}
  style="z-index: {win.zIndex}; left: {win.isMaximized ? 0 : win.x}px; top: {win.isMaximized ? 28 : win.y}px; width: {win.isMaximized ? '100%' : win.width + 'px'}; height: {win.isMaximized ? 'calc(100% - 28px - 80px)' : win.height + 'px'}"
  on:mousedown={focus}
  use:draggable={{ active: !win.isMaximized }}
  on:dragmove={handleDrag}
  use:resizable={{ minWidth: 200, minHeight: 150 }}
  on:resize={handleResize}
>
  <div class="title-bar">
    <div class="window-controls">
      <button class="control close" on:click|stopPropagation={() => desktop.closeWindow(win.id)} aria-label="Close"></button>
      <button class="control minimize" on:click|stopPropagation={() => desktop.toggleMinimize(win.id)} aria-label="Minimize"></button>
      <button class="control maximize" on:click|stopPropagation={() => desktop.toggleMaximize(win.id)} aria-label="Maximize"></button>
    </div>
    <div class="title">{win.title}</div>
  </div>
  
  <div class="content">
    <slot />
  </div>

  {#if !win.isMaximized}
    <div class="resizer n" data-direction="n"></div>
    <div class="resizer s" data-direction="s"></div>
    <div class="resizer e" data-direction="e"></div>
    <div class="resizer w" data-direction="w"></div>
    <div class="resizer ne" data-direction="ne"></div>
    <div class="resizer nw" data-direction="nw"></div>
    <div class="resizer se" data-direction="se"></div>
    <div class="resizer sw" data-direction="sw"></div>
  {/if}
</div>

<style>
  .window {
    position: absolute;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    transition: opacity 0.2s, transform 0.2s;
  }

  .window.minimized {
    display: none;
  }

  .window.active {
    box-shadow: 0 15px 45px rgba(0,0,0,0.6);
    border-color: var(--accent);
  }

  .title-bar {
    height: 32px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    padding: 0 12px;
    user-select: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
  }

  .window-controls {
    display: flex;
    gap: 8px;
    margin-right: 16px;
  }

  .control {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    position: relative;
    padding: 0;
  }

  .close { background: #ff5f56; }
  .minimize { background: #ffbd2e; }
  .maximize { background: #27c93f; }

  .control:hover::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.1);
    border-radius: 50%;
  }

  .title {
    flex: 1;
    text-align: center;
    font-size: 13px;
    color: var(--muted);
    font-weight: 500;
  }

  .content {
    flex: 1;
    overflow: auto;
    background: var(--bg);
  }

  /* Resizers */
  .resizer {
    position: absolute;
    z-index: 10;
  }
  .resizer.n { top: -2px; left: 0; right: 0; height: 4px; cursor: n-resize; }
  .resizer.s { bottom: -2px; left: 0; right: 0; height: 4px; cursor: s-resize; }
  .resizer.e { top: 0; bottom: 0; right: -2px; width: 4px; cursor: e-resize; }
  .resizer.w { top: 0; bottom: 0; left: -2px; width: 4px; cursor: w-resize; }
  .resizer.ne { top: -2px; right: -2px; width: 8px; height: 8px; cursor: ne-resize; }
  .resizer.nw { top: -2px; left: -2px; width: 8px; height: 8px; cursor: nw-resize; }
  .resizer.se { bottom: -2px; right: -2px; width: 8px; height: 8px; cursor: se-resize; }
  .resizer.sw { bottom: -2px; left: -2px; width: 8px; height: 8px; cursor: sw-resize; }

  @media (max-width: 640px) {
    .window {
      width: 100% !important;
      height: calc(100% - 28px - 80px) !important;
      left: 0 !important;
      top: 28px !important;
      border-radius: 0;
      transform: none !important;
    }
    .resizer { display: none; }
  }
</style>
