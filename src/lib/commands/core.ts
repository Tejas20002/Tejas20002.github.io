import type { LineType } from '../stores/terminal'

export interface OutputLine {
  type: LineType
  content: string
}

// ── Banner ────────────────────────────────────────────────────────────────────

export function getBanner(): OutputLine[] {
  return [
    { type: 'banner', content: '' },
    { type: 'banner', content: ' ████████╗     ██╗██╗  ██╗██╗██████╗  █████╗ ███╗   ██╗██╗' },
    { type: 'banner', content: '    ██╔══╝     ██║██║  ██║██║██╔══██╗██╔══██╗████╗  ██║██║' },
    { type: 'banner', content: '    ██║        ██║███████║██║██████╔╝███████║██╔██╗ ██║██║' },
    { type: 'banner', content: '    ██║   ██   ██║██╔══██║██║██╔══██╗██╔══██║██║╚██╗██║██║' },
    { type: 'banner', content: '    ██║   ╚█████╔╝██║  ██║██║██║  ██║██║  ██║██║ ╚████║██║' },
    { type: 'banner', content: '    ╚═╝    ╚════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝' },
    { type: 'banner', content: '' },
    { type: 'muted', content: '  Type "help" to see all available commands.' },
    { type: 'muted', content: '  Use ↑↓ for history, Tab for autocomplete.' },
    { type: 'banner', content: '' },
  ]
}

// ── Help ──────────────────────────────────────────────────────────────────────

export function helpCommand(): OutputLine[] {
  const rows: [string, string][] = [
    ['about', 'Learn about me — bio, skills, education'],
    ['projects', 'View my projects & GitHub links'],
    ['contact', 'Get in touch — email, GitHub, LinkedIn'],
    ['weather <city>', 'Real-time weather forecast for any city'],
    ['todo add <text>', 'Add a new todo item'],
    ['todo ls', 'List all todos'],
    ['todo done <id>', 'Mark a todo as complete'],
    ['todo rm <id>', 'Remove a todo item'],
    ['theme ls', 'List all available color themes'],
    ['theme set <name>', 'Switch to a theme instantly'],
    ['ssh <user@host>', 'Simulated SSH into a remote machine'],
    ['webssh <user@host>', 'Real SSH via WebSocket proxy'],
    ['clear', 'Clear the terminal'],
    ['echo <text>', 'Print text to terminal'],
    ['date', 'Show current date & time'],
    ['whoami', 'Who are you, visitor?'],
    ['banner', 'Re-display the welcome banner'],
    ['help', 'Show this help message'],
    ['feedback <msg>', 'Send feedback to me (Telegram)'],
  ]

  const tableRows = rows
    .map(([cmd, desc]) => `<tr><td class="cmd-table-cmd">${cmd}</td><td class="cmd-table-sep">—</td><td>${desc}</td></tr>`)
    .join('')

  return [
    { type: 'accent', content: '┌─ Available Commands ──────────────────────────────────────┐' },
    {
      type: 'html',
      content: `<table class="cmd-table">${tableRows}</table>`,
    },
    { type: 'accent', content: '└───────────────────────────────────────────────────────────┘' },
    { type: 'muted', content: 'Tip: press Tab to autocomplete, ↑↓ to cycle history.' },
  ]
}

// ── About ─────────────────────────────────────────────────────────────────────

export function aboutCommand(): OutputLine[] {
  return [
    { type: 'accent', content: '┌─ about ──────────────────────────────────────────────────┐' },
    { type: 'output', content: '  Name     : Tejas Hirani' },
    { type: 'output', content: '  Role     : DevOps Engineer' },
    { type: 'output', content: '  Location : Bhuj, Gujarat' },
    { type: 'output', content: '' },
    { type: 'output', content: '  DevOps Engineer with 2.5 years of experience building secure,' },
    { type: 'output', content: '  scalable AWS infrastructure using Terraform, Kubernetes, and' },
    { type: 'output', content: '  ArgoCD. Passionate about adopting best practices in DevOps' },
    { type: 'output', content: '  to drive scalability, security, and performance.' },
    { type: 'output', content: '' },
    { type: 'accent', content: '  ── Skills ───────────────────────────────────────────────' },
    { type: 'success', content: '  Cloud      : AWS (EC2, S3, EKS, RDS), GCP, Digital Ocean' },
    { type: 'success', content: '  CI/CD      : Jenkins, GitLab CI, GitHub Actions, ArgoCD' },
    { type: 'success', content: '  Infra/Orch : Terraform, Docker, Kubernetes, Helm' },
    { type: 'success', content: '  Monitoring : Grafana, Loki, ELK Stack, Prometheus' },
    { type: 'accent', content: '└───────────────────────────────────────────────────────────┘' },
  ]
}

// ── Projects ──────────────────────────────────────────────────────────────────

export function projectsCommand(): OutputLine[] {
  return [
    { type: 'accent', content: '┌─ projects ────────────────────────────────────────────────┐' },
    {
      type: 'html',
      content: `
<div style="line-height: 1.2;">
  <div style="color: var(--accent); font-weight: 700;">01. Scutum - Passwordless Auth</div>
  <div style="color: var(--text);">Password-less authentication system using OTP and token-based authentication.</div>
  <div style="color: var(--muted);">Stack: OTP · Token Auth · Security Protocols</div>
</div>
<div style="margin-top: 3px; line-height: 1.2;">
  <div style="color: var(--accent); font-weight: 700;">02. Gate Pass - Hostel Management</div>
  <div style="color: var(--text);">Backend for a hostel leave system with REST APIs for requests and entry/exit logging.</div>
  <div style="color: var(--muted);">Stack: Laravel · PHP · MySQL · REST APIs</div>
</div>
<div style="margin-top: 3px; line-height: 1.2;">
  <div style="color: var(--accent); font-weight: 700;">03. Rcher Chat Automation</div>
  <div style="color: var(--text);">Automated chatbot for WhatsApp/Telegram with rule-based and keyword response automation.</div>
  <div style="color: var(--muted);">Stack: Laravel · WhatsApp API · Telegram Bot API</div>
</div>
<div style="margin-top: 3px; line-height: 1.2;">
  <div style="color: var(--accent); font-weight: 700;">04. Immersive Chinese</div>
  <div style="color: var(--text);">Language-learning solution focused on spoken Chinese with clear pronunciation.</div>
  <div style="color: var(--muted);">Stack: Language Processing · Audio APIs</div>
</div>`.trim(),
    },
    { type: 'accent', content: '└───────────────────────────────────────────────────────────┘' },
  ]
}

// ── Contact ───────────────────────────────────────────────────────────────────

export function contactCommand(): OutputLine[] {
  return [
    { type: 'accent', content: '┌─ contact ─────────────────────────────────────────────────┐' },
    {
      type: 'html',
      content: `
<div style="margin-bottom: 2px;"><span style="color:var(--muted)">GitHub   →</span> <a href="https://github.com/tejas20002" target="_blank" style="color:var(--accent2); text-decoration:underline;">github.com/tejas20002</a></div>
<div style="margin-bottom: 2px;"><span style="color:var(--muted)">LinkedIn →</span> <a href="https://linkedin.com/in/tjhirani" target="_blank" style="color:var(--accent2); text-decoration:underline;">linkedin.com/in/tjhirani</a></div>
<div style="margin-bottom: 2px;"><span style="color:var(--muted)">Email    →</span> <a href="mailto:tejashirani55@gmail.com" style="color:var(--accent2); text-decoration:underline;">tejashirani55@gmail.com</a></div>
<div style="margin-bottom: 2px;"><span style="color:var(--muted)">Resume   →</span> <a href="./cv/Tejas-Hirani-FlowCV-Resume-20260108.pdf" target="_blank" style="color:var(--accent2); text-decoration:underline;">View PDF Resume</a></div>`.trim(),
    },
    { type: 'muted', content: '  Feel free to reach out — I\'m always open to new opportunities!' },
    { type: 'accent', content: '└───────────────────────────────────────────────────────────┘' },
  ]
}

// ── Date ──────────────────────────────────────────────────────────────────────

export function dateCommand(): OutputLine[] {
  const now = new Date()
  return [
    {
      type: 'output', content: now.toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        timeZoneName: 'short',
      })
    },
  ]
}

// ── Whoami ────────────────────────────────────────────────────────────────────

export function whoamiCommand(): OutputLine[] {
  return [
    { type: 'output', content: 'visitor' },
    { type: 'muted', content: 'You are an anonymous visitor exploring this terminal portfolio.' },
    { type: 'muted', content: 'Type "about" to learn about the host of this terminal.' },
  ]
}

// ── Echo ──────────────────────────────────────────────────────────────────────

export function echoCommand(args: string[]): OutputLine[] {
  return [{ type: 'output', content: args.join(' ') }]
}

export async function feedbackCommand(args: string[]): Promise<OutputLine[]> {
  const message = args.join(' ')
  if (!message) {
    return [{ type: 'error', content: 'Usage: feedback <your message>' }]
  }

  const token = import.meta.env.VITE_TELEGRAM_TOKEN
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    return [{ type: 'error', content: 'Error: Telegram feedback is not configured for this build.' }]
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
    `🚀 New Portfolio Feedback:\n\n${message}`
  )}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.ok) {
      return [
        { type: 'success', content: '✅ Feedback sent successfully!' },
        { type: 'muted', content: 'Message delivered directly to Telegram via bot.' },
      ]
    } else {
      return [{ type: 'error', content: `Failed to send! Telegram responded: ${data.description}` }]
    }
  } catch (err) {
    return [{ type: 'error', content: 'Error: Failed to connect to Telegram. Check your internet connection.' }]
  }
}

// ── Clear — handled in dispatcher ────────────────────────────────────────────
