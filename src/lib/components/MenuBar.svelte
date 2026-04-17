<script lang="ts">
  import { onMount } from 'svelte';
  import { desktop } from '../stores/desktop';

  let time = new Date();
  let showDateTimeInfo = false;
  let activeCategory: string | null = null;

  onMount(() => {
    const timer = setInterval(() => {
      time = new Date();
    }, 1000);
    return () => clearInterval(timer);
  });

  $: timeString = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  $: fullDateString = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calendar helpers
  $: currentMonth = time.getMonth();
  $: currentYear = time.getFullYear();
  $: today = time.getDate();

  $: monthLabel = time.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  $: calDays = getCalDays(currentYear, currentMonth);

  function getCalDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    // pad to full weeks
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }

  function toggleDateTime() { showDateTimeInfo = !showDateTimeInfo; activeCategory = null; }
  function toggleCategory(cat: string) { 
    if (activeCategory === cat) activeCategory = null;
    else { activeCategory = cat; showDateTimeInfo = false; }
  }
  function handleHover(cat: string) {
    if (activeCategory) activeCategory = cat;
  }
  function closeAll() { showDateTimeInfo = false; activeCategory = null; }

  // Actions
  function openAbout() { desktop.openWindow('settings', 'System Settings'); closeAll(); }
  function restart() { window.location.reload(); }
  function shutDown() { 
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999999;font-family:sans-serif;cursor:pointer;';
    overlay.innerHTML = '<h1>It is now safe to turn off your computer.</h1><p style="opacity:0.4;margin-top:20px;">Click anywhere to wake</p>';
    overlay.onclick = () => overlay.remove();
    document.body.appendChild(overlay);
    closeAll();
  }
  function hideAll() { desktop.minimizeAll(); closeAll(); }
  function showAll() { desktop.unminimizeAll(); closeAll(); }
  function newTerminal() { desktop.openWindow('terminal', 'Terminal'); closeAll(); }
  function openFinder() { desktop.openWindow('projects', 'Finder'); closeAll(); }
  function closeActiveWindow() { 
    const s = $desktop;
    if (s.activeWindowId) desktop.closeWindow(s.activeWindowId);
    closeAll();
  }
  function toggleDock() { desktop.updateConfig({ dockAutoHide: !$desktop.config.dockAutoHide }); closeAll(); }

</script>

<svelte:window on:click={closeAll} />

<div class="menu-bar">
  <div class="left">
    <!-- Apple Menu -->
    <div class="menu-group">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div 
        class="menu-item apple" 
        class:active={activeCategory === 'apple'}
        on:click|stopPropagation={() => toggleCategory('apple')}
        on:mouseenter={() => handleHover('apple')}
      >
        <svg width="15" height="18" viewBox="0 0 15 18" fill="currentColor">
          <path d="M12.44,9.64c-0.02,2.39,2,3.53,2.09,3.59c-0.02,0.06-0.33,1.13-1.12,2.25c-0.69,0.97-1.4,1.94-2.51,1.96 c-1.09,0.02-1.44-0.62-2.69-0.62c-1.25,0-1.64,0.6-2.67,0.64C4.46,18.5,3.67,17.47,2.98,16.48c-1.41-1.99-2.49-5.63-1.03-8.1 c0.72-1.22,2.02-1.99,3.43-2.01c1.07-0.02,2.08,0.7,2.74,0.7c0.66,0,1.88-0.89,3.17-0.77c0.54,0.02,2.05,0.21,3.03,1.6 c-0.08,0.05-1.81,1.02-1.79,3.06 M10.47,3.15c0.58-0.68,0.97-1.62,0.86-2.56c-0.83,0.03-1.84,0.54-2.44,1.22 c-0.54,0.6-1.02,1.57-0.89,2.49C8.91,4.35,9.88,3.83,10.47,3.15"></path>
        </svg>
      </div>
      {#if activeCategory === 'apple'}
        <div class="dropdown left-align" on:click|stopPropagation>
          <button class="drop-item" on:click={openAbout}>About This Mac</button>
          <hr />
          <button class="drop-item" on:click={openAbout}>System Settings...</button>
          <button class="drop-item" disabled>App Store...</button>
          <hr />
          <button class="drop-item" disabled>Recent Items</button>
          <hr />
          <button class="drop-item" disabled>Force Quit...</button>
          <hr />
          <button class="drop-item" disabled>Sleep</button>
          <button class="drop-item" on:click={restart}>Restart...</button>
          <button class="drop-item" on:click={shutDown}>Shut Down...</button>
        </div>
      {/if}
    </div>

    <!-- Portfolio Menu -->
    <div class="menu-group">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div 
        class="menu-item bold" 
        class:active={activeCategory === 'portfolio'}
        on:click|stopPropagation={() => toggleCategory('portfolio')}
        on:mouseenter={() => handleHover('portfolio')}
      >Portfolio</div>
      {#if activeCategory === 'portfolio'}
        <div class="dropdown left-align" on:click|stopPropagation>
          <button class="drop-item" on:click={openAbout}>About Portfolio</button>
          <hr />
          <button class="drop-item" on:click={openAbout}>Settings...</button>
          <hr />
          <button class="drop-item" on:click={hideAll}>Hide All Apps <span class="shortcut">⌘H</span></button>
          <button class="drop-item" on:click={showAll}>Show All</button>
          <hr />
          <button class="drop-item" on:click={closeAll}>Quit Portfolio <span class="shortcut">⌘Q</span></button>
        </div>
      {/if}
    </div>

    <!-- File Menu -->
    <div class="menu-group">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="menu-item" class:active={activeCategory === 'file'} on:click|stopPropagation={() => toggleCategory('file')} on:mouseenter={() => handleHover('file')}>File</div>
      {#if activeCategory === 'file'}
        <div class="dropdown left-align" on:click|stopPropagation>
          <button class="drop-item" on:click={newTerminal}>New Terminal <span class="shortcut">⌘N</span></button>
          <button class="drop-item" on:click={openFinder}>New Finder Window <span class="shortcut">⌘F</span></button>
          <hr />
          <button class="drop-item" on:click={closeActiveWindow}>Close Window <span class="shortcut">⌘W</span></button>
        </div>
      {/if}
    </div>

    <!-- Edit Menu -->
    <div class="menu-group">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="menu-item" class:active={activeCategory === 'edit'} on:click|stopPropagation={() => toggleCategory('edit')} on:mouseenter={() => handleHover('edit')}>Edit</div>
      {#if activeCategory === 'edit'}
        <div class="dropdown left-align" on:click|stopPropagation>
          <button class="drop-item" disabled>Undo <span class="shortcut">⌘Z</span></button>
          <button class="drop-item" disabled>Redo <span class="shortcut">⇧⌘Z</span></button>
          <hr />
          <button class="drop-item" disabled>Cut <span class="shortcut">⌘X</span></button>
          <button class="drop-item" disabled>Copy <span class="shortcut">⌘C</span></button>
          <button class="drop-item" disabled>Paste <span class="shortcut">⌘V</span></button>
        </div>
      {/if}
    </div>

    <!-- View Menu -->
    <div class="menu-group">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="menu-item" class:active={activeCategory === 'view'} on:click|stopPropagation={() => toggleCategory('view')} on:mouseenter={() => handleHover('view')}>View</div>
      {#if activeCategory === 'view'}
        <div class="dropdown left-align" on:click|stopPropagation>
          <button class="drop-item" on:click={() => { document.documentElement.requestFullscreen(); closeAll(); }}>Enter Full Screen <span class="shortcut">⌃⌘F</span></button>
          <hr />
          <button class="drop-item" on:click={toggleDock}>{$desktop.config.dockAutoHide ? 'Disable' : 'Enable'} Dock Hiding</button>
        </div>
      {/if}
    </div>

    <!-- Go Menu -->
    <div class="menu-group">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="menu-item" class:active={activeCategory === 'go'} on:click|stopPropagation={() => toggleCategory('go')} on:mouseenter={() => handleHover('go')}>Go</div>
      {#if activeCategory === 'go'}
        <div class="dropdown left-align" on:click|stopPropagation>
          <button class="drop-item" on:click={openFinder}>Documents</button>
          <button class="drop-item" on:click={openAbout}>System Settings</button>
          <button class="drop-item" on:click={newTerminal}>Utilities</button>
        </div>
      {/if}
    </div>

    <!-- Window Menu -->
    <div class="menu-group">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="menu-item" class:active={activeCategory === 'window'} on:click|stopPropagation={() => toggleCategory('window')} on:mouseenter={() => handleHover('window')}>Window</div>
      {#if activeCategory === 'window'}
        <div class="dropdown left-align" on:click|stopPropagation>
          <button class="drop-item" on:click={() => { if($desktop.activeWindowId) desktop.toggleMinimize($desktop.activeWindowId); closeAll(); }}>Minimize <span class="shortcut">⌘M</span></button>
          <button class="drop-item" on:click={() => { if($desktop.activeWindowId) desktop.toggleMaximize($desktop.activeWindowId); closeAll(); }}>Zoom</button>
          <hr />
          <button class="drop-item" on:click={showAll}>Bring All to Front</button>
        </div>
      {/if}
    </div>

    <!-- Help Menu -->
    <div class="menu-group">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="menu-item" class:active={activeCategory === 'help'} on:click|stopPropagation={() => toggleCategory('help')} on:mouseenter={() => handleHover('help')}>Help</div>
      {#if activeCategory === 'help'}
        <div class="dropdown left-align" on:click|stopPropagation>
          <button class="drop-item" on:click={() => { desktop.openWindow('terminal', 'Help'); closeAll(); }}>Portfolio Help</button>
          <hr />
          <div class="search-item">
            <input type="text" placeholder="Search" />
          </div>
        </div>
      {/if}
    </div>
  </div>

  <div class="right">
    <!-- Date + Time clickable area -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="datetime-trigger" on:click|stopPropagation={toggleDateTime}>
      <span class="date-text">{fullDateString}</span>
      <span class="time-text">{timeString}</span>
    </div>

    {#if showDateTimeInfo}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="datetime-dropdown" on:click|stopPropagation>
        <!-- Big current time -->
        <div class="drop-time">{timeString}</div>
        <div class="drop-date">{fullDateString}</div>
        <hr class="drop-divider" />
        <!-- Mini calendar -->
        <div class="cal-header">{monthLabel}</div>
        <div class="cal-grid">
          {#each ['Su','Mo','Tu','We','Th','Fr','Sa'] as d}
            <div class="cal-cell dow">{d}</div>
          {/each}
          {#each calDays as day}
            <div class="cal-cell" class:today={day === today}>{day ?? ''}</div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .menu-bar {
    height: 28px;
    background: rgba(var(--bg-rgb, 0, 0, 0), 0.5);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    font-size: 13px;
    color: var(--text, #e0e0e0);
    user-select: none;
    z-index: 10000;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    position: relative;
  }

  .left, .right {
    display: flex;
    align-items: center;
    gap: 4px;
    position: relative;
  }

  .menu-item {
    cursor: default;
    padding: 2px 7px;
    border-radius: 4px;
    transition: background 0.15s;
    color: var(--text, #e0e0e0);
    background: none;
    border: none;
    font-size: 13px;
    font-family: inherit;
  }

  .menu-item:hover {
    background: rgba(255, 255, 255, 0.18);
  }

  .menu-item.bold { font-weight: 600; }

  .apple { padding: 2px 8px; }

  /* ── Date/time trigger ─────────────────────────────────────────── */
  .datetime-trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 2px 8px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .datetime-trigger:hover { background: rgba(255,255,255,0.15); }

  .date-text {
    font-size: 12px;
    opacity: 0.85;
  }
  .time-text {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  /* ── Dropdown system ────────────────────────────────────────────────── */
  .menu-group {
    position: relative;
    display: flex;
    align-items: center;
  }

  .menu-item.active {
    background: rgba(255, 255, 255, 0.2);
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 4px);
    background: rgba(30,30,35, 0.85);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 5px;
    min-width: 220px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    z-index: 100000;
  }

  .datetime-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    width: 240px;
    background: rgba(28, 28, 32, 0.92);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 16px 40px rgba(0,0,0,0.6);
    color: #fff;
    z-index: 99999;
  }

  .left-align { left: 0; }

  .drop-item {
    background: none;
    border: none;
    color: #fff;
    font-size: 13px;
    text-align: left;
    padding: 4px 12px;
    border-radius: 4px;
    width: 100%;
    cursor: default;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: inherit;
  }

  .drop-item:hover:not(:disabled) {
    background: #0071e3;
    color: #fff;
  }

  .drop-item:disabled {
    opacity: 0.3;
  }

  .shortcut {
    opacity: 0.5;
    font-size: 11px;
    margin-left: 20px;
  }

  hr {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.1);
    margin: 4px 0;
  }

  .search-item {
    padding: 4px 10px;
  }

  .search-item input {
    width: 100%;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 4px;
    color: #fff;
    padding: 3px 8px;
    font-size: 12px;
  }

  /* ── Calendar styles ─────────────────────────────────────────── */
  .drop-time {
    font-size: 36px;
    font-weight: 200;
    letter-spacing: 0.02em;
    line-height: 1;
    text-align: center;
  }

  .drop-date {
    font-size: 12px;
    opacity: 0.6;
    text-align: center;
    margin-top: 4px;
  }

  .drop-divider {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.1);
    margin: 12px 0 8px;
  }

  .cal-header {
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 6px;
    opacity: 0.8;
  }

  .cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .cal-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    height: 24px;
    border-radius: 50%;
    opacity: 0.7;
  }

  .cal-cell.dow {
    font-weight: 600;
    opacity: 0.4;
    font-size: 10px;
  }

  .cal-cell.today {
    background: #0071e3;
    opacity: 1;
    color: #fff;
    font-weight: 700;
  }
</style>
