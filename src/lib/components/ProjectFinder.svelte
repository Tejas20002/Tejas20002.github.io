<script lang="ts">
  import { projects, type Project } from '../data/projects';
  import { desktop } from '../stores/desktop';

  let selectedProject: Project | null = null;

  function openProject(p: Project) {
    selectedProject = p;
  }

  // Simple Markdown-ish parser
  function parseMD(text: string) {
    return text
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }
</script>

<div class="finder">
  <div class="sidebar">
    <div class="section-title">Favorites</div>
    <div class="nav-item active">
      <span class="icon">📁</span> Projects
    </div>
    <div class="nav-item">
      <span class="icon">🏠</span> Home
    </div>
    <div class="nav-item">
      <span class="icon">🚀</span> Applications
    </div>
  </div>
  
  <div class="main-content">
    {#if !selectedProject}
      <div class="project-grid">
        {#each projects as project}
          <div class="project-card" on:click={() => openProject(project)}>
            <div class="project-icon">{project.icon || '📦'}</div>
            <div class="project-name">{project.title}</div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="project-detail">
        <button class="back-btn" on:click={() => selectedProject = null}>
          ← Back
        </button>
        <div class="rendered-content">
          {@html parseMD(selectedProject.content)}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .finder {
    display: flex;
    height: 100%;
    background: var(--bg);
    color: var(--text);
  }

  .sidebar {
    width: 200px;
    background: rgba(255, 255, 255, 0.05);
    border-right: 1px solid var(--border);
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .section-title {
    font-size: 11px;
    color: var(--muted);
    font-weight: 700;
    margin: 10px 0 5px 10px;
    text-transform: uppercase;
  }

  .nav-item {
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.2s;
  }

  .nav-item:hover { background: rgba(255, 255, 255, 0.05); }
  .nav-item.active { background: rgba(255, 255, 255, 0.1); font-weight: 600; }

  .main-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 20px;
  }

  .project-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 10px;
    border-radius: 10px;
    transition: background 0.2s;
  }

  .project-card:hover { background: rgba(255, 255, 255, 0.05); }

  .project-icon { font-size: 40px; margin-bottom: 8px; }
  .project-name { font-size: 12px; text-align: center; font-weight: 500; }

  .project-detail { max-width: 800px; margin: 0 auto; }
  
  .back-btn {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    padding: 5px 0;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .rendered-content :global(h1) { font-size: 2em; margin-bottom: 0.5em; border-bottom: 1px solid var(--border); padding-bottom: 0.2em; }
  .rendered-content :global(h2) { font-size: 1.5em; margin-top: 1em; margin-bottom: 0.5em; }
  .rendered-content :global(li) { margin-left: 20px; }
</style>
