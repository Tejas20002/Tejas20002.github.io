<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte'
  import { terminalStore } from '../stores/terminal'
  import { dispatch } from '../commands/index'
  import OutputLine from './OutputLine.svelte'
  import TerminalInput from './TerminalInput.svelte'
  import WebSSHOverlay from './WebSSHOverlay.svelte'
  // Banner removed for cleaner UI

  let scrollEl: HTMLDivElement
  let inputRef: TerminalInput
  let isProcessing = false

  // Subscribe to store
  $: history = $terminalStore.history
  $: sshSession = $terminalStore.sshSession
  $: webSSHOpen = $terminalStore.webSSHOpen
  $: webSSHTarget = $terminalStore.webSSHTarget

  // Auto-scroll to bottom when history changes
  $: if (history.length) scrollToBottom()

  async function scrollToBottom() {
    await tick()
    if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight
  }

  async function handleSubmit(e: CustomEvent<string>) {
    const input = e.detail
    if (isProcessing) return
    isProcessing = true
    try {
      await dispatch(input)
    } finally {
      isProcessing = false
      await tick()
      inputRef?.focus()
    }
  }

  function handleWindowClick() {
    inputRef?.focus()
  }

  onMount(() => {
    // Focus input on load (banner removed)
    inputRef?.focus();
  })
</script>

<svelte:window on:click={handleWindowClick} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="terminal-wrapper">
  <!-- ── Scrollable area ──────────────────────────────────────────────────── -->
  <div class="terminal-content scanlines" bind:this={scrollEl}>
    <div class="padding-wrapper">
      {#each history as line (line.id)}
        <OutputLine {line} />
      {/each}

      <!-- ── Input area (now inline) ──────────────────────────────────────── -->
      <div class="input-line-wrapper">
        {#if isProcessing}
          <div class="processing">
            <span class="processing-dot">●</span>
            <span class="processing-dot">●</span>
            <span class="processing-dot">●</span>
            <span class="processing-text">processing...</span>
          </div>
        {:else}
          <TerminalInput bind:this={inputRef} on:submit={handleSubmit} />
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- ── WebSSH Overlay ────────────────────────────────────────────────────── -->
{#if webSSHOpen && webSSHTarget}
  <WebSSHOverlay
    user={webSSHTarget.user}
    host={webSSHTarget.host}
    port={webSSHTarget.port}
    on:close={() => terminalStore.closeWebSSH()}
  />
{/if}

<style>
  .terminal-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: rgba(var(--bg-rgb, 0, 0, 0), 0.5); /* 50% transparent */
    position: relative;
    overflow: hidden;
  }

  /* ── Content area (scrollable) ───────────────────────────────────────── */
  .terminal-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: auto; /* Faster response for terminal */
  }

  .padding-wrapper {
    padding: 12px 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .input-line-wrapper {
    margin-top: 4px;
    flex-shrink: 0;
  }

  /* ── Processing indicator ──────────────────────────────────────────────── */
  .processing {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--muted);
    padding: 2px 0;
  }

  .processing-dot {
    animation: dot-bounce 1.2s infinite;
    font-size: 0.6em;
    color: var(--accent);
  }

  .processing-dot:nth-child(2) { animation-delay: 0.2s; }
  .processing-dot:nth-child(3) { animation-delay: 0.4s; }

  .processing-text {
    font-size: 0.85em;
    margin-left: 4px;
  }

  @keyframes dot-bounce {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
    40%            { opacity: 1;   transform: scale(1.2); }
  }

  /* ── Mobile ────────────────────────────────────────────────────────────── */
  @media (max-width: 640px) {
    .title-text {
      display: none;
    }

    .output-area {
      padding: 8px 10px 4px;
    }

    .input-area {
      padding: 6px 10px 10px;
    }
  }
</style>
