<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { terminalStore } from '../stores/terminal'
  import { COMMAND_NAMES } from '../commands/index'
  import { getSimSSHSession } from '../commands/ssh'

  export let placeholder = ''

  const dispatch = createEventDispatcher<{ submit: string }>()

  let inputValue = ''
  let inputEl: HTMLInputElement
  let historyIndex = -1
  let localHistory: string[] = []
  let tabMatches: string[] = []
  let tabIndex = 0
  let lastTabInput = ''

  // Subscribe to command history
  $: {
    const unsub = terminalStore.subscribe(s => { localHistory = s.commandHistory })
    unsub()
  }

  function getPrompt(): string {
    const sess = getSimSSHSession()
    if (sess) return `${sess.user}@${sess.host}:${sess.cwd}$`
    return 'visitor@portfolio:~$'
  }

  $: prompt = getPrompt()

  function onKeyDown(e: KeyboardEvent) {
    // ── Arrow Up: prev history ──────────────────────────────────────────────
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (localHistory.length === 0) return
      historyIndex = Math.min(historyIndex + 1, localHistory.length - 1)
      inputValue = localHistory[historyIndex] ?? ''
      // Move caret to end on next tick
      setTimeout(() => inputEl?.setSelectionRange(inputValue.length, inputValue.length), 0)
      return
    }

    // ── Arrow Down: next history ────────────────────────────────────────────
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex <= 0) {
        historyIndex = -1
        inputValue = ''
        return
      }
      historyIndex--
      inputValue = localHistory[historyIndex] ?? ''
      return
    }

    // ── Tab: autocomplete ───────────────────────────────────────────────────
    if (e.key === 'Tab') {
      e.preventDefault()
      const val = inputValue.toLowerCase().trim()
      const [cmd] = val.split(/\s+/)

      if (val !== lastTabInput || tabMatches.length === 0) {
        // Fresh autocomplete: find all matches
        lastTabInput = val
        tabMatches = COMMAND_NAMES.filter(c => c.startsWith(cmd))
        tabIndex = 0
      } else {
        // Cycle through matches
        tabIndex = (tabIndex + 1) % tabMatches.length
      }

      if (tabMatches.length === 1) {
        inputValue = tabMatches[0] + ' '
        lastTabInput = inputValue.trim()
      } else if (tabMatches.length > 1) {
        inputValue = tabMatches[tabIndex]
      }
      return
    }

    // Reset tab state on other keys
    if (e.key !== 'Tab') {
      tabMatches = []
      lastTabInput = ''
    }

    // ── Enter: submit ───────────────────────────────────────────────────────
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = inputValue
      inputValue = ''
      historyIndex = -1
      tabMatches = []
      if (val.trim()) terminalStore.pushCommand(val.trim())
      dispatch('submit', val)
    }
  }

  export function focus() {
    inputEl?.focus()
  }

  onMount(() => {
    inputEl?.focus()
  })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="input-row" on:click={() => inputEl?.focus()}>
  <span class="prompt-text">{prompt}</span>
  <div class="input-wrapper">
    <input
      bind:this={inputEl}
      bind:value={inputValue}
      on:keydown={onKeyDown}
      type="text"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      inputmode="text"
      aria-label="Terminal input"
      id="terminal-input"
      {placeholder}
      class="terminal-input"
    />
    <span class="cursor-follow" style="margin-left: {inputValue.length}ch">
      <span class="cursor-blink" aria-hidden="true"></span>
    </span>
  </div>
</div>

<!-- Tab autocomplete suggestions -->
{#if tabMatches.length > 1}
  <div class="tab-suggestions">
    {#each tabMatches as match, i}
      <span class="tab-item" class:active={i === tabIndex}>{match}</span>
    {/each}
  </div>
{/if}

<style>
  .input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 2px 0;
    cursor: text;
  }

  .prompt-text {
    color: var(--prompt);
    white-space: nowrap;
    flex-shrink: 0;
    font-weight: 600;
    user-select: none;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    flex: 1;
  }

  .terminal-input {
    background: transparent;
    border: none;
    outline: none;
    color: var(--text);
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    width: 100%;
    caret-color: transparent; /* we use our own cursor */
    padding: 0;
  }

  .cursor-follow {
    position: absolute;
    left: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
  }

  .tab-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    padding: 4px 0;
    color: var(--muted);
    font-size: 0.9em;
  }

  .tab-item {
    padding: 0 4px;
    border-radius: 2px;
  }

  .tab-item.active {
    color: var(--accent);
    background: var(--surface);
  }
</style>
