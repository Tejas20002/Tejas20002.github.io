<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import { terminalStore } from '../stores/terminal'

  export let user: string
  export let host: string
  export let port: number

  const dispatch = createEventDispatcher<{ close: void }>()

  let termEl: HTMLDivElement
  let statusMsg = `Connecting to ${user}@${host}:${port}...`
  let connected = false
  let xterm: any = null
  let fitAddon: any = null
  let ws: WebSocket | null = null
  let cleanedUp = false

  const BACKEND_URL = import.meta.env.VITE_WEBSSH_BACKEND_URL as string | undefined

  onMount(async () => {
    try {
      // Dynamic import to keep xterm out of main bundle
      const [{ Terminal }, { FitAddon }] = await Promise.all([
        import('@xterm/xterm'),
        import('@xterm/addon-fit'),
      ])

      // Import xterm CSS
      await import('@xterm/xterm/css/xterm.css')

      xterm = new Terminal({
        cursorBlink: true,
        theme: {
          background: '#0d0d0d',
          foreground: '#f0f0f0',
          cursor: '#00ff41',
        },
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        fontSize: 14,
        scrollback: 5000,
      })

      fitAddon = new FitAddon()
      xterm.loadAddon(fitAddon)
      xterm.open(termEl)
      fitAddon.fit()

      // Connect to WebSSH backend
      const wsUrl = BACKEND_URL!
      ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        statusMsg = `Connected — ${user}@${host}:${port}`
        connected = true
        // Send connection params
        ws!.send(JSON.stringify({ type: 'connect', user, host, port,
          cols: xterm.cols, rows: xterm.rows }))
      }

      ws.onmessage = (ev) => {
        if (typeof ev.data === 'string') {
          try {
            const msg = JSON.parse(ev.data)
            if (msg.type === 'data') xterm.write(msg.data)
            if (msg.type === 'error') {
              xterm.write(`\r\n\x1b[31mError: ${msg.message}\x1b[0m\r\n`)
            }
          } catch {
            xterm.write(ev.data)
          }
        } else {
          // Binary data
          ev.data.arrayBuffer().then((buf: ArrayBuffer) =>
            xterm.write(new Uint8Array(buf))
          )
        }
      }

      ws.onerror = () => {
        statusMsg = 'Connection failed'
        if (xterm) xterm.write('\r\n\x1b[31mWebSocket connection failed.\x1b[0m\r\n')
      }

      ws.onclose = () => {
        if (!cleanedUp && xterm) {
          xterm.write('\r\n\x1b[33mConnection closed.\x1b[0m\r\n')
        }
      }

      // Forward key input to backend
      xterm.onData((data: string) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'data', data }))
        }
      })

      // Handle resize
      const resizeObs = new ResizeObserver(() => {
        fitAddon?.fit()
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'resize', cols: xterm.cols, rows: xterm.rows }))
        }
      })
      resizeObs.observe(termEl)

    } catch (err) {
      statusMsg = 'Failed to load terminal'
      console.error('WebSSH init error:', err)
    }
  })

  onDestroy(() => {
    cleanedUp = true
    ws?.close()
    xterm?.dispose()
  })

  function handleClose() {
    terminalStore.addLines([
      { type: 'muted', content: `WebSSH session to ${user}@${host} closed.` },
    ])
    dispatch('close')
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') handleClose()
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="xterm-overlay" role="dialog" aria-label="WebSSH Terminal">
  <div class="xterm-overlay-header">
    <div class="header-left">
      <span class="status-dot" class:connected></span>
      <span class="status-msg">{statusMsg}</span>
    </div>
    <div class="header-center">
      <span class="header-title">🔒 WebSSH — {user}@{host}:{port}</span>
    </div>
    <button class="close-btn" on:click={handleClose} title="Close (Esc)">
      ✕ Close
    </button>
  </div>

  <div class="xterm-overlay-body" bind:this={termEl}></div>
</div>

<style>
  .xterm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.95);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.98); }
    to   { opacity: 1; transform: scale(1); }
  }

  .xterm-overlay-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    gap: 12px;
    color: var(--muted);
    font-size: 12px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--warning);
    flex-shrink: 0;
    transition: background 0.3s;
  }

  .status-dot.connected {
    background: var(--success);
  }

  .status-msg {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .header-center {
    flex: 2;
    text-align: center;
    color: var(--text);
    font-weight: 600;
  }

  .close-btn {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 3px 10px;
    border-radius: 3px;
    cursor: pointer;
    font-family: inherit;
    font-size: 11px;
    transition: all 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .close-btn:hover {
    color: var(--error);
    border-color: var(--error);
  }

  .xterm-overlay-body {
    flex: 1;
    overflow: hidden;
    padding: 4px 8px;
  }
</style>
