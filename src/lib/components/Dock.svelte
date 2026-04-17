<script lang="ts">
  import { desktop, type AppId } from '../stores/desktop';

  interface AppIcon {
    id: AppId;
    name: string;
    icon: string;
  }

  const apps: AppIcon[] = [
    { id: 'terminal', name: 'Terminal', icon: '💻' },
    { id: 'projects', name: 'Finder', icon: '📂' },
    { id: 'contact', name: 'Mail', icon: '✉️' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  function openApp(id: AppId, name: string) {
    desktop.openWindow(id, name);
  }

  $: openWindowIds = $desktop.windows.map(w => w.appId);
  $: pos = $desktop.config.dockPosition;
  $: autoHide = $desktop.config.dockAutoHide;

  let isVisible = true;
  let hideTimeout: ReturnType<typeof setTimeout>;

  function showDock() {
    clearTimeout(hideTimeout);
    isVisible = true;
  }

  function schedulHide() {
    if (!autoHide) return;
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      isVisible = false;
    }, 800);
  }

  // If auto-hide is turned off, always show
  $: if (!autoHide) { clearTimeout(hideTimeout); isVisible = true; }
</script>

<!-- ── Edge hotzone (always fixed to screen edge, only active when hidden) ── -->
{#if autoHide && !isVisible}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="edge-hotzone"
    class:edge-bottom={pos === 'bottom'}
    class:edge-left={pos === 'left'}
    class:edge-right={pos === 'right'}
    on:mouseenter={showDock}
  ></div>
{/if}

<!-- ── Dock ─────────────────────────────────────────────────────────────── -->
<div
  class="dock-container"
  class:pos-bottom={pos === 'bottom'}
  class:pos-left={pos === 'left'}
  class:pos-right={pos === 'right'}
  class:hidden={!isVisible}
  on:mouseenter={showDock}
  on:mouseleave={schedulHide}
  role="toolbar"
  aria-label="Application Dock"
  tabindex="0"
>
  <div class="dock" style="transform: scale({$desktop.config.dockSize})">
    {#each apps as app}
      <button
        class="dock-item-wrapper"
        on:click={() => openApp(app.id, app.name)}
        aria-label="Open {app.name}"
      >
        <div class="dock-item" title={app.name}>
          <span class="icon">{app.icon}</span>
          {#if openWindowIds.includes(app.id)}
            <div class="indicator"></div>
          {/if}
        </div>
        <div class="tooltip">{app.name}</div>
      </button>
    {/each}
  </div>
</div>

<style>
  /* ── Edge hotzone ─────────────────────────────────────────────────────── */
  /* Stays glued to the screen edge even when the dock is hidden */
  .edge-hotzone {
    position: fixed;
    z-index: 9999;
    pointer-events: auto;
  }
  .edge-bottom { bottom: 0; left: 0; right: 0; height: 6px; cursor: default; }
  .edge-left   { left: 0; top: 0; bottom: 0; width: 6px; cursor: default; }
  .edge-right  { right: 0; top: 0; bottom: 0; width: 6px; cursor: default; }

  /* ── Dock container ───────────────────────────────────────────────────── */
  .dock-container {
    position: fixed;
    display: flex;
    z-index: 10000;
    pointer-events: none;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.35s ease;
  }

  /* Positioning */
  .pos-bottom { bottom: 12px; left: 0; right: 0; justify-content: center; }
  .pos-left   { left: 12px; top: 0; bottom: 0; align-items: center; }
  .pos-right  { right: 12px; top: 0; bottom: 0; align-items: center; }

  /* Hidden states */
  .hidden.pos-bottom { transform: translateY(120%); opacity: 0; }
  .hidden.pos-left   { transform: translateX(-120%); opacity: 0; }
  .hidden.pos-right  { transform: translateX(120%); opacity: 0; }

  /* ── Dock pill ────────────────────────────────────────────────────────── */
  .dock {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 8px;
    border-radius: 20px;
    display: flex;
    gap: 12px;
    pointer-events: auto;
    box-shadow: 0 20px 50px rgba(0,0,0,0.4);
  }

  .pos-left .dock, .pos-right .dock { flex-direction: column; }

  /* ── Dock items ───────────────────────────────────────────────────────── */
  .dock-item-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    background: none;
    border: none;
    padding: 0;
  }

  .dock-item-wrapper:hover { transform: scale(1.4) translateY(-10px); }
  .pos-left .dock-item-wrapper:hover  { transform: scale(1.4) translateX(10px); }
  .pos-right .dock-item-wrapper:hover { transform: scale(1.4) translateX(-10px); }

  .dock-item {
    width: 44px;
    height: 44px;
    background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    position: relative;
    box-shadow: inset 0 0 10px rgba(255,255,255,0.05);
  }

  .indicator {
    position: absolute;
    bottom: -6px;
    width: 4px;
    height: 4px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 5px #fff;
  }

  .tooltip {
    position: absolute;
    top: -40px;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    white-space: nowrap;
  }

  .dock-item-wrapper:hover .tooltip { opacity: 1; }
</style>
