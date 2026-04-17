<script lang="ts">
  import MenuBar from './MenuBar.svelte';
  import Dock from './Dock.svelte';
  import Window from './Window.svelte';
  import { desktop } from '../stores/desktop';
  import { draggable } from '../actions';
  import Terminal from './Terminal.svelte';
  import ProjectFinder from './ProjectFinder.svelte';
  import ContactApp from './ContactApp.svelte';
  import SettingsApp from './SettingsApp.svelte';

  // Desktop Icons
  const icons = [
    { id: 'terminal', name: 'Terminal', icon: '💻' },
    { id: 'projects', name: 'Projects', icon: '📂' },
    { id: 'contact', name: 'Contact', icon: '✉️' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  function openApp(id: any, name: string) {
    desktop.openWindow(id, name);
  }

  function handleIconDrag(id: string, e: CustomEvent) {
    const pos = $desktop.iconPositions[id] || { x: 0, y: 0 };
    desktop.updateIconPosition(id, {
      x: pos.x + e.detail.dx,
      y: pos.y + e.detail.dy
    });
  }
</script>

<div class="desktop-env">
  <MenuBar />
  
  <div class="wallpaper" style="background-image: url({$desktop.config.wallpaper})">
    <!-- Desktop Icons Grid -->
    <div class="desktop-icons">
      {#each icons as icon}
        <div 
          class="icon-wrapper" 
          style="transform: translate({($desktop.iconPositions[icon.id]?.x || 0)}px, {($desktop.iconPositions[icon.id]?.y || 0)}px)"
          on:dblclick={() => openApp(icon.id, icon.name)}
          use:draggable
          on:dragmove={(e) => handleIconDrag(icon.id, e)}
        >
          <div class="icon-visual">{icon.icon}</div>
          <div class="icon-label">{icon.name}</div>
        </div>
      {/each}
    </div>

    <!-- Active Windows -->
    {#each $desktop.windows as win (win.id)}
      <Window {win}>
        {#if win.appId === 'terminal'}
          <Terminal />
        {:else if win.appId === 'projects'}
          <ProjectFinder />
        {:else if win.appId === 'contact'}
          <ContactApp />
        {:else if win.appId === 'settings'}
          <SettingsApp />
        {/if}
      </Window>
    {/each}
  </div>

  <Dock />
</div>

<style>
  .desktop-env {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #000;
  }

  .wallpaper {
    flex: 1;
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    /* Gradient fallback if image fails */
    background-color: #0a0a1a;
    background-image: url(none);
    padding: 20px;
    transition: background-image 0.5s ease;
  }

  .desktop-icons {
    display: grid;
    grid-template-columns: repeat(auto-fill, 80px);
    grid-template-rows: repeat(auto-fill, 80px);
    grid-auto-flow: column;
    gap: 15px;
    height: 100%;
  }

  .icon-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 8px;
    border-radius: 12px;
    transition: background 0.2s;
    user-select: none;
  }

  .icon-wrapper:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .icon-visual {
    width: 40px;
    height: 40px;
    background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 4px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  }

  .icon-label {
    color: white;
    font-size: 10px;
    font-weight: 500;
    text-shadow: 0 1px 3px rgba(0,0,0,0.8);
    text-align: center;
    max-width: 65px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .placeholder-app {
    padding: 40px;
    color: var(--text);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
  }

  h2 { margin-bottom: 16px; color: var(--accent); }
</style>
