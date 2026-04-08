<script lang="ts">
  import type { OutputLine } from '../stores/terminal'

  export let line: OutputLine
</script>

{#if line.type === 'html'}
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  <div class="terminal-line line-{line.type}" data-id={line.id}>
    {@html line.content}
  </div>
{:else}
  <div class="terminal-line line-{line.type}" data-id={line.id}>
    <span class="line-content">{line.content}</span>
  </div>
{/if}

<style>
  .terminal-line {
    padding: 1px 0;
    min-height: 1.4em;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.5;
  }

  .line-input {
    color: var(--accent);
  }

  .line-output {
    color: var(--text);
  }

  .line-error {
    color: var(--error);
  }

  .line-success {
    color: var(--success);
  }

  .line-muted {
    color: var(--muted);
  }

  .line-accent {
    color: var(--accent2);
  }

  .line-banner {
    color: var(--accent);
    font-weight: 700;
  }

  .line-warning {
    color: var(--warning);
  }

  .line-html {
    color: var(--text);
  }
</style>
