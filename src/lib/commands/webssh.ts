import type { OutputLine } from './core'

const BACKEND_URL = import.meta.env.VITE_WEBSSH_BACKEND_URL as string | undefined

export function websshCommand(args: string[]): { lines: OutputLine[]; openWebSSH?: { user: string; host: string; port: number } } {
  // Check if backend is configured
  if (!BACKEND_URL) {
    return {
      lines: [
        { type: 'warning', content: '⚠  WebSSH backend not configured.' },
        { type: 'output',  content: '' },
        { type: 'output',  content: 'To enable real SSH sessions, set up the companion backend:' },
        { type: 'muted',   content: '  1. cd webssh-server && npm install' },
        { type: 'muted',   content: '  2. node index.js          (runs on port 4242)' },
        { type: 'muted',   content: '  3. Create .env.local and add:' },
        { type: 'accent',  content: '     VITE_WEBSSH_BACKEND_URL=ws://localhost:4242' },
        { type: 'muted',   content: '  4. npm run dev           (restart Vite)' },
        { type: 'output',  content: '' },
        { type: 'muted',   content: 'For production, deploy webssh-server/ to Railway or Render.' },
        { type: 'muted',   content: 'See webssh-server/README.md for deployment instructions.' },
      ],
    }
  }

  // Parse user@host
  const target = args.find(a => a.includes('@'))
  if (!target) {
    return {
      lines: [
        { type: 'error', content: 'Usage: webssh <user@host>  or  webssh <user@host:port>' },
      ],
    }
  }
  const [user, hostPart] = target.split('@')
  const [host, portStr] = hostPart.split(':')
  const port = portStr ? parseInt(portStr) : 22

  return {
    lines: [
      { type: 'muted', content: `Launching WebSSH to ${user}@${host}:${port} via ${BACKEND_URL}...` },
      { type: 'muted', content: 'Opening terminal overlay...' },
    ],
    openWebSSH: { user, host, port: isNaN(port) ? 22 : port },
  }
}
