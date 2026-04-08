import type { OutputLine } from './core'

// ── Fake Host Database ────────────────────────────────────────────────────────

interface FakeFile {
  type: 'file' | 'dir'
  content?: string
}

interface FakeHost {
  motd: string
  username: string
  distro: string
  fs: Record<string, FakeFile>
}

const FAKE_HOSTS: Record<string, FakeHost> = {
  default: {
    motd: 'Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)',
    username: 'admin',
    distro: 'Linux ubuntu 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux',
    fs: {
      '/home/admin': { type: 'dir' },
      '/home/admin/readme.txt': { type: 'file', content: 'Welcome, intruder. 👀\nThere\'s nothing to see here... or is there?' },
      '/home/admin/secret.txt': { type: 'file', content: '🔐 ACCESS DENIED\nJust kidding. The real secret is: you made it this far!' },
      '/home/admin/projects': { type: 'dir' },
      '/home/admin/projects/app.js': { type: 'file', content: 'console.log("Hello from the fake server! 🚀")' },
    },
  },
  '192.168.1.1': {
    motd: 'OpenWrt 23.05.0 — Router shell',
    username: 'root',
    distro: 'Linux OpenWrt 5.15.162 #0 SMP armv7l GNU/Linux',
    fs: {
      '/root': { type: 'dir' },
      '/root/config': { type: 'file', content: 'hostname=fakerouter\npassword=hunter2\n# lol jk' },
      '/etc/banner': { type: 'file', content: '  ___                 _       _ \n / _ \\ _ __  ___ _ _| |_ __ _| |\n| (_) | \'_ \\/ -_) \'_|  _/ _` | |\n \\___/| .__/\\___|_|  \\__\\__,_|_|\n      |_|  OpenWrt Router v23.05\n' },
    },
  },
  'dev.server': {
    motd: '🚀 Dev Server · Node.js v22 · Ready for deployment',
    username: 'deploy',
    distro: 'Linux devserver 6.1.0-18-amd64 #1 SMP PREEMPT Debian 6.1.76-1 x86_64 GNU/Linux',
    fs: {
      '/home/deploy': { type: 'dir' },
      '/home/deploy/app': { type: 'dir' },
      '/home/deploy/app/package.json': { type: 'file', content: '{\n  "name": "my-app",\n  "version": "2.0.0",\n  "scripts": { "start": "node index.js" }\n}' },
      '/home/deploy/logs': { type: 'dir' },
      '/home/deploy/logs/access.log': { type: 'file', content: '[INFO] GET / 200 12ms\n[INFO] GET /api/health 200 3ms\n[INFO] POST /api/data 201 45ms' },
    },
  },
}

function getHostDB(host: string): FakeHost {
  return FAKE_HOSTS[host] ?? FAKE_HOSTS.default
}

// ── Active SSH Session State ──────────────────────────────────────────────────

export interface SimSSHSession {
  user: string
  host: string
  cwd: string
  db: FakeHost
}

let activeSession: SimSSHSession | null = null

export function getSimSSHSession(): SimSSHSession | null { return activeSession }

export function startSimSSH(user: string, host: string): OutputLine[] {
  const db = getHostDB(host)
  const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

  // We'll just output synchronously (the terminal handles async)
  activeSession = { user, host, cwd: `/home/${db.username}`, db }

  return [
    { type: 'muted',   content: `Connecting to ${host} (port 22)...` },
    { type: 'muted',   content: 'Authenticating with password...' },
    { type: 'success', content: `Connected to ${host}` },
    { type: 'muted',   content: db.motd },
    { type: 'output',  content: '' },
    { type: 'muted',   content: 'Type commands to interact. Type "exit" to disconnect.' },
    { type: 'output',  content: '' },
  ]
}

export function handleSimSSHCommand(input: string): { lines: OutputLine[]; exited: boolean } {
  if (!activeSession) return { lines: [{ type: 'error', content: 'No active SSH session.' }], exited: true }

  const [cmd, ...args] = input.trim().split(/\s+/)
  const sess = activeSession

  if (cmd === 'exit' || cmd === 'logout' || cmd === 'quit') {
    activeSession = null
    return {
      lines: [
        { type: 'muted', content: '' },
        { type: 'muted', content: `Connection to ${sess.host} closed.` },
        { type: 'output', content: '' },
      ],
      exited: true,
    }
  }

  if (cmd === 'pwd') {
    return { lines: [{ type: 'output', content: sess.cwd }], exited: false }
  }

  if (cmd === 'whoami') {
    return { lines: [{ type: 'output', content: sess.user || sess.db.username }], exited: false }
  }

  if (cmd === 'uname') {
    return { lines: [{ type: 'output', content: sess.db.distro }], exited: false }
  }

  if (cmd === 'hostname') {
    return { lines: [{ type: 'output', content: sess.host }], exited: false }
  }

  if (cmd === 'ls') {
    const prefix = sess.cwd
    const entries = Object.keys(sess.db.fs)
      .filter(k => {
        const relative = k.slice(prefix.length)
        return k.startsWith(prefix + '/') && !relative.slice(1).includes('/')
      })
      .map(k => {
        const name = k.split('/').pop()!
        const entry = sess.db.fs[k]
        return entry.type === 'dir'
          ? `<span style="color:var(--accent2);font-weight:700;">${name}/</span>`
          : `<span style="color:var(--text);">${name}</span>`
      })
    if (entries.length === 0) {
      return { lines: [{ type: 'muted', content: '(empty directory)' }], exited: false }
    }
    return {
      lines: [{ type: 'html', content: `<div style="display:flex;flex-wrap:wrap;gap:8px 20px;">${entries.join('')}</div>` }],
      exited: false,
    }
  }

  if (cmd === 'cat') {
    const file = args[0]
    if (!file) return { lines: [{ type: 'error', content: 'cat: missing file operand' }], exited: false }
    const path = file.startsWith('/') ? file : `${sess.cwd}/${file}`
    const entry = sess.db.fs[path]
    if (!entry) return { lines: [{ type: 'error', content: `cat: ${file}: No such file or directory` }], exited: false }
    if (entry.type === 'dir') return { lines: [{ type: 'error', content: `cat: ${file}: Is a directory` }], exited: false }
    return { lines: [{ type: 'output', content: entry.content ?? '' }], exited: false }
  }

  if (cmd === 'cd') {
    const target = args[0] ?? `/home/${sess.db.username}`
    const newPath = target.startsWith('/') ? target : `${sess.cwd}/${target}`
    const entry = sess.db.fs[newPath]
    if (!entry || entry.type !== 'dir') {
      return { lines: [{ type: 'error', content: `cd: ${target}: No such file or directory` }], exited: false }
    }
    activeSession!.cwd = newPath
    return { lines: [], exited: false }
  }

  if (cmd === 'echo') {
    return { lines: [{ type: 'output', content: args.join(' ') }], exited: false }
  }

  if (cmd === 'date') {
    return { lines: [{ type: 'output', content: new Date().toString() }], exited: false }
  }

  if (cmd === 'clear') {
    return { lines: [{ type: 'output', content: '\x1b[CLEAR]' }], exited: false }
  }

  if (!cmd) return { lines: [], exited: false }

  return {
    lines: [{ type: 'error', content: `bash: ${cmd}: command not found` }],
    exited: false,
  }
}

export function parseSSHArgs(args: string[]): { user: string; host: string; port: number } | null {
  // Formats: user@host  OR  user@host:port
  const target = args.find(a => a.includes('@'))
  if (!target) return null
  const [userPart, hostPart] = target.split('@')
  if (!hostPart) return null
  const [host, portStr] = hostPart.split(':')
  const port = portStr ? parseInt(portStr) : 22
  return { user: userPart, host, port: isNaN(port) ? 22 : port }
}
