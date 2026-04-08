import type { OutputLine } from './core'
import { todoStore } from '../stores/todo'

export function todoCommand(args: string[]): OutputLine[] {
  const sub = args[0]?.toLowerCase()

  if (!sub || sub === 'help') {
    return [
      { type: 'accent', content: '  Todo commands:' },
      { type: 'output', content: '    todo add <text>  — Add a new item' },
      { type: 'output', content: '    todo ls          — List all items' },
      { type: 'output', content: '    todo done <id>   — Mark item as complete' },
      { type: 'output', content: '    todo rm <id>     — Remove an item' },
    ]
  }

  if (sub === 'add') {
    const text = args.slice(1).join(' ').trim()
    if (!text) return [{ type: 'error', content: 'Usage: todo add <text>' }]
    const item = todoStore.add(text)
    return [{ type: 'success', content: `✓ Added [${item.id}] ${item.text}` }]
  }

  if (sub === 'ls') {
    const todos = todoStore.getAll()
    if (todos.length === 0) {
      return [{ type: 'muted', content: 'No todos yet. Use "todo add <text>" to create one.' }]
    }
    return [
      { type: 'accent', content: '  ── Todos ──────────────────────────────────────────────────' },
      ...todos.map(t => ({
        type: (t.done ? 'muted' : 'output') as OutputLine['type'],
        content: `  [${t.id}] ${t.done ? '✓' : '○'} ${t.text}${t.done ? ' (done)' : ''}`,
      })),
      { type: 'muted', content: `  Total: ${todos.length} | Done: ${todos.filter(t => t.done).length}` },
    ]
  }

  if (sub === 'done') {
    const id = parseInt(args[1])
    if (isNaN(id)) return [{ type: 'error', content: 'Usage: todo done <id>' }]
    const ok = todoStore.complete(id)
    return ok
      ? [{ type: 'success', content: `✓ Marked [${id}] as done!` }]
      : [{ type: 'error', content: `Todo #${id} not found.` }]
  }

  if (sub === 'rm' || sub === 'remove' || sub === 'delete') {
    const id = parseInt(args[1])
    if (isNaN(id)) return [{ type: 'error', content: 'Usage: todo rm <id>' }]
    const ok = todoStore.remove(id)
    return ok
      ? [{ type: 'success', content: `✓ Removed todo #${id}.` }]
      : [{ type: 'error', content: `Todo #${id} not found.` }]
  }

  return [{ type: 'error', content: `Unknown todo subcommand: "${sub}". Try "todo help".` }]
}
