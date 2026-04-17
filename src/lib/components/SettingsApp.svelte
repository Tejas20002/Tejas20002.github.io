<script lang="ts">
  import { desktop } from '../stores/desktop';
  import { todoStore } from '../stores/todo';
  import { THEMES, applyTheme, themeStore } from '../themes';
  import { aboutCommand } from '../commands/core';

  let activeSection = 'about';
  let newTodo = '';
  let feedback = '';
  let feedbackSent = false;

  const wallpapers = [
    { id: 'galaxy',    label: 'Galaxy',    url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=2560&q=80' },
    { id: 'aurora',    label: 'Aurora',    url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=2560&q=80' },
    { id: 'mountain',  label: 'Mountains', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2560&q=80' },
    { id: 'ocean',     label: 'Ocean',     url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=2560&q=80' },
    { id: 'forest',    label: 'Forest',    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=2560&q=80' },
    { id: 'city',      label: 'City',      url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=2560&q=80' },
  ];

  const sections = [
    { id: 'about',   name: 'About',         icon: '👤' },
    { id: 'todo',    name: 'Todo List',      icon: '✅' },
    { id: 'themes',  name: 'Appearance',     icon: '🎨' },
    { id: 'weather', name: 'Weather',        icon: '🌤️' },
    { id: 'feedback',name: 'Feedback',       icon: '💬' },
    { id: 'desktop', name: 'Dock & Desktop', icon: '🖥️' }
  ];

  // ── Weather ──────────────────────────────────────────────────────────────
  interface WeatherData {
    temp: number;
    feelsLike: number;
    humidity: number;
    windspeed: number;
    weathercode: number;
    city: string;
  }

  let weather: WeatherData | null = null;
  let weatherLoading = false;
  let weatherError = '';
  let weatherCity = '';

  const WMO: Record<number, { label: string; emoji: string }> = {
    0:  { label: 'Clear sky',          emoji: '☀️' },
    1:  { label: 'Mainly clear',        emoji: '🌤️' },
    2:  { label: 'Partly cloudy',       emoji: '⛅' },
    3:  { label: 'Overcast',            emoji: '☁️' },
    45: { label: 'Foggy',               emoji: '🌫️' },
    48: { label: 'Icy fog',             emoji: '🌫️' },
    51: { label: 'Light drizzle',       emoji: '🌦️' },
    61: { label: 'Slight rain',         emoji: '🌧️' },
    63: { label: 'Moderate rain',       emoji: '🌧️' },
    65: { label: 'Heavy rain',          emoji: '🌧️' },
    71: { label: 'Slight snow',         emoji: '🌨️' },
    80: { label: 'Rain showers',        emoji: '🌦️' },
    95: { label: 'Thunderstorm',        emoji: '⛈️' },
  };

  function wmoInfo(code: number) {
    return WMO[code] ?? { label: 'Unknown', emoji: '🌡️' };
  }

  async function fetchWeather(lat: number, lon: number, city: string) {
    weatherLoading = true;
    weatherError = '';
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current_weather=true&hourly=relativehumidity_2m,apparent_temperature,windspeed_10m` +
        `&timezone=auto&forecast_days=1`
      );
      const data = await res.json();
      const cw = data.current_weather;
      weather = {
        temp: Math.round(cw.temperature),
        feelsLike: Math.round(data.hourly.apparent_temperature?.[new Date().getHours()] ?? cw.temperature),
        humidity: data.hourly.relativehumidity_2m?.[new Date().getHours()] ?? 0,
        windspeed: Math.round(cw.windspeed),
        weathercode: cw.weathercode,
        city
      };
    } catch (e) {
      weatherError = 'Could not fetch weather data.';
    } finally {
      weatherLoading = false;
    }
  }

  async function detectLocation() {
    if (!navigator.geolocation) {
      weatherError = 'Geolocation not supported.';
      return;
    }
    weatherLoading = true;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        // Reverse geocode with Open-Meteo place
        try {
          const geo = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const gd = await geo.json();
          const city = gd.address?.city || gd.address?.town || gd.address?.village || 'Your location';
          weatherCity = city;
          fetchWeather(lat, lon, city);
        } catch {
          fetchWeather(lat, lon, 'Your location');
        }
      },
      () => { weatherError = 'Location access denied.'; weatherLoading = false; }
    );
  }

  async function searchCity() {
    if (!weatherCity.trim()) return;
    weatherLoading = true;
    weatherError = '';
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(weatherCity)}&format=json&limit=1`
      );
      const places = await res.json();
      if (!places.length) { weatherError = 'City not found.'; weatherLoading = false; return; }
      const { lat, lon, display_name } = places[0];
      const cityName = display_name.split(',')[0];
      fetchWeather(parseFloat(lat), parseFloat(lon), cityName);
    } catch {
      weatherError = 'Search failed.';
      weatherLoading = false;
    }
  }

  function handleAddTodo() {
    if (newTodo.trim()) {
      todoStore.add(newTodo);
      newTodo = '';
    }
  }

  async function sendFeedback() {
    // In a real app, this would call the feedbackCommand logic
    // For now, simulator
    feedbackSent = true;
    setTimeout(() => { feedbackSent = false; feedback = ''; }, 3000);
  }

  $: aboutData = aboutCommand();
  $: todos = $todoStore;
  $: currentTheme = $themeStore;
</script>

<div class="settings-container">
  <div class="sidebar">
    <div class="sidebar-header">System Settings</div>
    <div class="nav-list">
      {#each sections as s}
        <button 
          class="nav-item" 
          class:active={activeSection === s.id}
          on:click={() => activeSection = s.id}
          aria-pressed={activeSection === s.id}
        >
          <span class="icon">{s.icon}</span>
          <span>{s.name}</span>
        </button>
      {/each}
    </div>
  </div>

  <div class="main-pane">
    {#if activeSection === 'about'}
      <div class="pane-content">
        <h1>About Me</h1>
        <div class="about-grid">
          {#each aboutData as line}
            {#if line.type === 'output'}
              <div class="about-line">{line.content}</div>
            {/if}
          {/each}
        </div>
        <p class="mt-4">Passionate DevOps Engineer dedicated to building scalable and secure infrastructure.</p>
      </div>

    {:else if activeSection === 'todo'}
      <div class="pane-content">
        <h1>Todo List</h1>
        <div class="todo-input">
          <input 
            type="text" 
            bind:value={newTodo} 
            placeholder="Add new task..." 
            on:keydown={(e) => e.key === 'Enter' && handleAddTodo()} 
          />
          <button on:click={handleAddTodo}>Add</button>
        </div>
        <div class="todo-list">
          {#each todos as todo}
            <div class="todo-item" class:done={todo.done}>
              <button 
                class="check" 
                on:click={() => !todo.done && todoStore.complete(todo.id)}
              >
                {todo.done ? '✓' : ''}
              </button>
              <span class="text">{todo.text}</span>
              <button class="remove" on:click={() => todoStore.remove(todo.id)}>×</button>
            </div>
          {/each}
        </div>
      </div>

    {:else if activeSection === 'themes'}
      <div class="pane-content">
        <h1>Theme Manager</h1>
        <div class="theme-grid">
          {#each THEMES as theme}
            <div 
              class="theme-card" 
              class:active={currentTheme === theme.id}
              on:click={() => applyTheme(theme.id)}
            >
              <div class="theme-preview" style="--t-bg: var(--bg); --t-acc: var(--accent);">
                {theme.emoji}
              </div>
              <div class="theme-info">
                <div class="theme-name">{theme.name}</div>
                <div class="theme-desc">{theme.description}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>

    {:else if activeSection === 'weather'}
      <div class="pane-content">
        <h1>🌤️ Weather</h1>
        <p class="weather-sub">Get live weather for any city or your current location.</p>

        <!-- Search bar -->
        <div class="weather-search">
          <input
            type="text"
            placeholder="Enter city name…"
            bind:value={weatherCity}
            on:keydown={(e) => e.key === 'Enter' && searchCity()}
          />
          <button class="w-btn search-btn" on:click={searchCity}>Search</button>
          <button class="w-btn locate-btn" on:click={detectLocation} title="Use my location">📍</button>
        </div>

        {#if weatherLoading}
          <div class="weather-state">⏳ Fetching weather…</div>
        {:else if weatherError}
          <div class="weather-state error">{weatherError}</div>
        {:else if weather}
          <div class="weather-card">
            <div class="wc-top">
              <div class="wc-emoji">{wmoInfo(weather.weathercode).emoji}</div>
              <div class="wc-info">
                <div class="wc-city">{weather.city}</div>
                <div class="wc-desc">{wmoInfo(weather.weathercode).label}</div>
              </div>
              <div class="wc-temp">{weather.temp}°C</div>
            </div>
            <div class="wc-details">
              <div class="wc-detail">
                <span class="detail-icon">🌡️</span>
                <span>Feels like</span>
                <strong>{weather.feelsLike}°C</strong>
              </div>
              <div class="wc-detail">
                <span class="detail-icon">💧</span>
                <span>Humidity</span>
                <strong>{weather.humidity}%</strong>
              </div>
              <div class="wc-detail">
                <span class="detail-icon">💨</span>
                <span>Wind</span>
                <strong>{weather.windspeed} km/h</strong>
              </div>
            </div>
          </div>
        {:else}
          <div class="weather-state">Search a city or use 📍 to get started.</div>
        {/if}
      </div>

    {:else if activeSection === 'feedback'}

      <div class="pane-content">
        <h1>Send Feedback</h1>
        <p>Your message will be delivered directly to Tejas's Telegram bot.</p>
        <textarea 
          bind:value={feedback} 
          placeholder="What's on your mind?"
          disabled={feedbackSent}
        ></textarea>
        <button 
          class="send-btn" 
          disabled={!feedback.trim() || feedbackSent}
          on:click={sendFeedback}
        >
          {feedbackSent ? '✅ Message Sent!' : 'Send Message'}
        </button>
      </div>

    {:else if activeSection === 'desktop'}
      <div class="pane-content">
        <h1>Dock Settings</h1>
        <div class="settings-group">
          <label for="dock-pos">Position on screen</label>
          <div id="dock-pos" class="toggle-group">
            <button 
              class:active={$desktop.config.dockPosition === 'left'}
              on:click={() => desktop.updateConfig({ dockPosition: 'left' })}
            >Left</button>
            <button 
              class:active={$desktop.config.dockPosition === 'bottom'}
              on:click={() => desktop.updateConfig({ dockPosition: 'bottom' })}
            >Bottom</button>
            <button 
              class:active={$desktop.config.dockPosition === 'right'}
              on:click={() => desktop.updateConfig({ dockPosition: 'right' })}
            >Right</button>
          </div>
        </div>

        <div class="settings-group">
          <label for="dock-auto">Dock Behavior</label>
          <div id="dock-auto" class="toggle-group">
            <button 
              class:active={$desktop.config.dockAutoHide}
              on:click={() => desktop.updateConfig({ dockAutoHide: true })}
            >Auto-hide</button>
            <button 
              class:active={!$desktop.config.dockAutoHide}
              on:click={() => desktop.updateConfig({ dockAutoHide: false })}
            >Always Show</button>
          </div>
        </div>
        
        <div class="settings-group">
          <label for="icon-scale">Icon Scale: {Math.round($desktop.config.dockSize * 100)}%</label>
          <input 
            id="icon-scale"
            type="range" 
            min="0.5" 
            max="1.5" 
            step="0.1" 
            value={$desktop.config.dockSize} 
            on:input={(e) => desktop.updateConfig({ dockSize: parseFloat(e.currentTarget.value) })}
          />
        </div>

        <!-- Wallpaper Presets -->
        <div class="settings-group">
          <label>Wallpaper</label>
          <div class="wallpaper-grid">
            {#each wallpapers as wp}
              <button
                class="wp-card"
                class:selected={$desktop.config.wallpaper === wp.url}
                on:click={() => desktop.updateConfig({ wallpaper: wp.url })}
                title={wp.label}
                style="background-image: url({wp.url})"
              >
                <span class="wp-label">{wp.label}</span>
              </button>
            {/each}
          </div>
          <!-- Custom URL -->
          <div class="custom-url">
            <input
              type="url"
              placeholder="Or paste a custom image URL…"
              value={$desktop.config.wallpaper}
              on:change={(e) => desktop.updateConfig({ wallpaper: e.currentTarget.value })}
            />
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .settings-container {
    display: flex;
    height: 100%;
    background: var(--bg);
    color: var(--text);
  }

  .sidebar {
    width: 220px;
    background: rgba(255, 255, 255, 0.03);
    border-right: 1px solid var(--border);
    padding: 20px 12px;
    backdrop-filter: blur(10px);
  }

  .sidebar-header {
    font-size: 11px;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    margin-bottom: 20px;
    padding-left: 10px;
  }

  .nav-item {
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s;
    margin-bottom: 2px;
    background: none;
    border: none;
    width: 100%;
    color: inherit;
    text-align: left;
  }

  .nav-item:hover { background: rgba(255, 255, 255, 0.05); }
  .nav-item.active { background: var(--accent); color: #000; font-weight: 600; }

  .main-pane {
    flex: 1;
    overflow-y: auto;
  }

  .pane-content {
    padding: 40px;
    max-width: 700px;
  }

  h1 { font-size: 28px; margin-bottom: 24px; font-weight: 700; }

  /* About */
  .about-grid { font-family: var(--font-mono); font-size: 14px; }
  .about-line { margin-bottom: 4px; }

  /* Todo */
  .todo-input { display: flex; gap: 10px; margin-bottom: 20px; }
  .todo-input input { flex: 1; background: var(--surface); border: 1px solid var(--border); padding: 10px; border-radius: 8px; color: #fff; }
  .todo-input button { background: var(--accent); color: #000; border: none; padding: 0 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }

  .todo-list { display: flex; flex-direction: column; gap: 8px; }
  .todo-item { display: flex; align-items: center; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 10px; gap: 12px; }
  .todo-item.done .text { text-decoration: line-through; color: var(--muted); }
  .check { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--accent); background: none; color: var(--accent); display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .text { flex: 1; }
  .remove { background: none; border: none; color: var(--error); font-size: 20px; cursor: pointer; opacity: 0.5; }
  .remove:hover { opacity: 1; }

  /* Themes */
  .theme-grid { display: grid; gap: 12px; }
  .theme-card { display: flex; align-items: center; background: var(--surface); padding: 15px; border-radius: 12px; gap: 15px; cursor: pointer; border: 1px solid transparent; transition: all 0.2s; }
  .theme-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.1); }
  .theme-card.active { border-color: var(--accent); background: rgba(255,255,255,0.05); }
  .theme-preview { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px; background: rgba(255,255,255,0.05); }
  .theme-name { font-weight: 600; }
  .theme-desc { font-size: 12px; color: var(--muted); }

  /* Feedback */
  textarea { width: 100%; height: 150px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 15px; color: #fff; margin-bottom: 15px; resize: none; }
  .send-btn { background: var(--accent); color: #000; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; cursor: pointer; width: 100%; transition: all 0.2s; }
  .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Desktop Settings */
  .settings-group { margin-bottom: 30px; }
  .settings-group label { display: block; margin-bottom: 10px; font-weight: 600; }
  .toggle-group { display: flex; background: var(--surface); padding: 4px; border-radius: 10px; gap: 4px; }
  .toggle-group button { flex: 1; padding: 8px; border-radius: 6px; border: none; background: none; color: var(--muted); cursor: pointer; font-size: 13px; }
  .toggle-group button.active { background: rgba(255,255,255,0.1); color: #fff; }
  input[type="range"] { width: 100%; accent-color: var(--accent); }

  /* Whoami */
  .center { display: flex; align-items: center; justify-content: center; height: 100%; }
  .whoami-card { text-align: center; background: var(--surface); padding: 40px; border-radius: 20px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
  .id-icon { font-size: 64px; margin-bottom: 20px; }
  .stats { margin-top: 20px; display: flex; flex-direction: column; gap: 8px; color: var(--muted); font-size: 13px; }

  /* Wallpaper presets */
  .wallpaper-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 14px;
  }
  .wp-card {
    aspect-ratio: 16/9;
    border-radius: 10px;
    border: 2px solid transparent;
    background-size: cover;
    background-position: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, transform 0.15s;
  }
  .wp-card:hover { transform: scale(1.03); }
  .wp-card.selected { border-color: var(--accent); }
  .wp-label {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: rgba(0,0,0,0.55);
    font-size: 11px;
    color: #fff;
    text-align: center;
    padding: 3px 0;
    backdrop-filter: blur(4px);
  }
  .custom-url input {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 9px 12px;
    color: #fff;
    font-size: 13px;
  }

  /* ── Weather ──────────────────────────────────────────────────────────── */
  .weather-sub { color: var(--muted); font-size: 14px; margin-bottom: 20px; }

  .weather-search {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
  }
  .weather-search input {
    flex: 1;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    color: #fff;
    font-size: 14px;
  }
  .w-btn {
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: opacity 0.2s;
  }
  .w-btn:hover { opacity: 0.85; }
  .search-btn { background: var(--accent); color: #000; }
  .locate-btn { background: var(--surface); color: var(--text); font-size: 18px; padding: 10px 14px; }

  .weather-state {
    text-align: center;
    color: var(--muted);
    padding: 40px 0;
    font-size: 15px;
  }
  .weather-state.error { color: #ff6b6b; }

  .weather-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px;
    padding: 24px;
    backdrop-filter: blur(10px);
  }

  .wc-top {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }
  .wc-emoji { font-size: 52px; line-height: 1; }
  .wc-info { flex: 1; }
  .wc-city { font-size: 20px; font-weight: 700; margin-bottom: 2px; }
  .wc-desc { font-size: 13px; color: var(--muted); }
  .wc-temp { font-size: 48px; font-weight: 200; color: var(--accent); }

  .wc-details {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .wc-detail {
    background: rgba(255,255,255,0.04);
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--muted);
  }
  .wc-detail strong { font-size: 16px; color: var(--text); font-weight: 600; }
  .detail-icon { font-size: 20px; }
</style>

