import { writable } from 'svelte/store'

// ── Output Line Types ─────────────────────────────────────────────────────────

export type LineType = 'input' | 'output' | 'error' | 'success' | 'muted' | 'accent' | 'banner' | 'html' | 'warning'

export interface OutputLine {
  id: string
  type: LineType
  content: string       // plain text or HTML string (when type === 'html')
  timestamp: Date
}

// ── SSH Session State ─────────────────────────────────────────────────────────

export interface SSHSession {
  active: boolean
  user: string
  host: string
  cwd: string
}

// ── Terminal Store ────────────────────────────────────────────────────────────

interface TerminalState {
  history: OutputLine[]
  commandHistory: string[]
  historyIndex: number
  sshSession: SSHSession | null
  webSSHOpen: boolean
  webSSHTarget: { user: string; host: string; port: number } | null
}

function createTerminalStore() {
  const { subscribe, update, set } = writable<TerminalState>({
    history: [],
    commandHistory: [],
    historyIndex: -1,
    sshSession: null,
    webSSHOpen: false,
    webSSHTarget: null,
  })

  let counter = 0

  function makeId(): string {
    return `line-${++counter}-${Date.now()}`
  }

  return {
    subscribe,
    set,

    addLine(type: LineType, content: string) {
      update(s => ({
        ...s,
        history: [...s.history, { id: makeId(), type, content, timestamp: new Date() }],
      }))
    },

    addLines(lines: Array<{ type: LineType; content: string }>) {
      update(s => ({
        ...s,
        history: [
          ...s.history,
          ...lines.map(l => ({ id: makeId(), type: l.type, content: l.content, timestamp: new Date() })),
        ],
      }))
    },

    clear() {
      update(s => ({ ...s, history: [] }))
    },

    pushCommand(cmd: string) {
      update(s => {
        const trimmed = cmd.trim()
        if (!trimmed) return s
        const filtered = s.commandHistory.filter(c => c !== trimmed)
        return { ...s, commandHistory: [trimmed, ...filtered].slice(0, 100), historyIndex: -1 }
      })
    },

    setHistoryIndex(idx: number) {
      update(s => ({ ...s, historyIndex: idx }))
    },

    setSSHSession(session: SSHSession | null) {
      update(s => ({ ...s, sshSession: session }))
    },

    openWebSSH(user: string, host: string, port: number) {
      update(s => ({ ...s, webSSHOpen: true, webSSHTarget: { user, host, port } }))
    },

    closeWebSSH() {
      update(s => ({ ...s, webSSHOpen: false, webSSHTarget: null }))
    },
  }
}

export const terminalStore = createTerminalStore()
