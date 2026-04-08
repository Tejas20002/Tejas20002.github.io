import type { LineType } from '../stores/terminal'
import { terminalStore } from '../stores/terminal'
import {
  getBanner,
  helpCommand,
  aboutCommand,
  projectsCommand,
  contactCommand,
  dateCommand,
  whoamiCommand,
  echoCommand,
  feedbackCommand,
} from './core'
import { todoCommand } from './todo'
import { themeCommand } from './theme'
import { weatherCommand } from './weather'
import {
  parseSSHArgs,
  startSimSSH,
  handleSimSSHCommand,
  getSimSSHSession,
} from './ssh'
import { websshCommand } from './webssh'

export interface OutputLine {
  type: LineType
  content: string
}

// All top-level command names for tab autocomplete
export const COMMAND_NAMES = [
  'about', 'banner', 'clear', 'contact', 'date', 'echo',
  'feedback', 'help', 'projects', 'ssh', 'theme', 'todo',
  'weather', 'webssh', 'whoami',
]

// ── Main Dispatcher ───────────────────────────────────────────────────────────

export async function dispatch(rawInput: string): Promise<void> {
  const input = rawInput.trim()
  if (!input) return

  // If inside a simulated SSH session, route to SSH handler
  const sshSess = getSimSSHSession()
  if (sshSess) {
    // Echo the input with SSH prompt
    terminalStore.addLine('input', `${sshSess.user}@${sshSess.host}:${sshSess.cwd}$ ${input}`)

    // Special: clear inside SSH
    if (input === 'clear') { terminalStore.clear(); return }

    const { lines, exited } = handleSimSSHCommand(input)
    if (lines.length > 0) terminalStore.addLines(lines)
    if (exited) terminalStore.setSSHSession(null)
    return
  }

  // Echo command with normal prompt
  terminalStore.addLine('input', `visitor@portfolio:~$ ${input}`)

  const [cmd, ...args] = input.split(/\s+/)
  const command = cmd.toLowerCase()

  // ── Built-in commands ─────────────────────────────────────────────────────

  if (command === 'clear') {
    terminalStore.clear()
    return
  }

  if (command === 'banner') {
    terminalStore.addLines(getBanner())
    return
  }

  if (command === 'help') {
    terminalStore.addLines(helpCommand())
    return
  }

  if (command === 'about') {
    terminalStore.addLines(aboutCommand())
    return
  }

  if (command === 'projects') {
    terminalStore.addLines(projectsCommand())
    return
  }

  if (command === 'contact') {
    terminalStore.addLines(contactCommand())
    return
  }

  if (command === 'date') {
    terminalStore.addLines(dateCommand())
    return
  }

  if (command === 'whoami') {
    terminalStore.addLines(whoamiCommand())
    return
  }

  if (command === 'echo') {
    terminalStore.addLines(echoCommand(args))
    return
  }

  if (command === 'feedback') {
    terminalStore.addLine('muted', 'Sending feedback...')
    const lines = await feedbackCommand(args)
    terminalStore.addLines(lines)
    return
  }

  if (command === 'todo') {
    terminalStore.addLines(todoCommand(args))
    return
  }

  if (command === 'theme') {
    terminalStore.addLines(themeCommand(args))
    return
  }

  if (command === 'weather') {
    terminalStore.addLine('muted', 'Fetching weather data...')
    const lines = await weatherCommand(args)
    terminalStore.addLines(lines)
    return
  }

  if (command === 'ssh') {
    const parsed = parseSSHArgs(args)
    if (!parsed) {
      terminalStore.addLines([
        { type: 'error', content: 'Usage: ssh <user@host>  or  ssh <user@host:port>' },
        { type: 'muted', content: 'Example: ssh admin@192.168.1.1  |  ssh root@dev.server' },
      ])
      return
    }
    const lines = startSimSSH(parsed.user, parsed.host)
    terminalStore.addLines(lines)
    terminalStore.setSSHSession({ active: true, user: parsed.user, host: parsed.host, cwd: '/home/' + parsed.user })
    return
  }

  if (command === 'webssh') {
    const result = websshCommand(args)
    terminalStore.addLines(result.lines)
    if (result.openWebSSH) {
      const { user, host, port } = result.openWebSSH
      terminalStore.openWebSSH(user, host, port)
    }
    return
  }

  // ── Unknown command ───────────────────────────────────────────────────────

  // Fuzzy match suggestion
  const similar = COMMAND_NAMES.find(c => c.startsWith(command[0]))
  terminalStore.addLines([
    { type: 'error',  content: `command not found: ${command}` },
    { type: 'muted',  content: similar ? `Did you mean "${similar}"? Type "help" for all commands.` : 'Type "help" to see available commands.' },
  ])
}
