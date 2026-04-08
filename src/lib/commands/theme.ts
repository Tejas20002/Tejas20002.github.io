import type { OutputLine } from './core'
import { THEMES, applyTheme } from '../themes'

export function themeCommand(args: string[]): OutputLine[] {
  const sub = args[0]?.toLowerCase()

  // theme ls — list all themes
  if (!sub || sub === 'ls' || sub === 'list') {
    const rows = THEMES.map(t =>
      `<tr>
        <td style="color:var(--accent);padding-right:12px;white-space:nowrap;">${t.emoji} ${t.id}</td>
        <td style="color:var(--text);padding-right:8px;">${t.name}</td>
        <td style="color:var(--muted);">${t.description}</td>
      </tr>`
    ).join('')

    return [
      { type: 'accent', content: '┌─ Available Themes ───────────────────────────────────────┐' },
      { type: 'html',   content: `<table style="border-collapse:collapse;margin:4px 0 4px 4px;">${rows}</table>` },
      { type: 'muted',  content: '  Usage: theme set <name>' },
      { type: 'accent', content: '└───────────────────────────────────────────────────────────┘' },
    ]
  }

  // theme set <name>
  if (sub === 'set' || sub === 'apply' || sub === 'use') {
    const name = args[1]?.toLowerCase()
    if (!name) return [{ type: 'error', content: 'Usage: theme set <name>  (try "theme ls" to see options)' }]

    const ok = applyTheme(name)
    if (!ok) {
      const ids = THEMES.map(t => t.id).join(', ')
      return [
        { type: 'error',  content: `Theme "${name}" not found.` },
        { type: 'muted',  content: `Available: ${ids}` },
      ]
    }
    const theme = THEMES.find(t => t.id === name)!
    return [
      { type: 'success', content: `${theme.emoji} Theme switched to "${theme.name}"!` },
      { type: 'muted',   content: 'Theme preference saved to localStorage.' },
    ]
  }

  return [
    { type: 'error',  content: `Unknown theme subcommand: "${sub}"` },
    { type: 'output', content: 'Usage: theme ls  |  theme set <name>' },
  ]
}
