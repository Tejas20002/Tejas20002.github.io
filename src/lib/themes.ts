// ── Theme Registry ────────────────────────────────────────────────────────────

export interface Theme {
  id: string
  name: string
  description: string
  emoji: string
}

export const THEMES: Theme[] = [
  { id: 'matrix',    name: 'Matrix',    description: 'Classic green-on-black hacker aesthetic',   emoji: '🟩' },
  { id: 'dracula',   name: 'Dracula',   description: 'Popular dark theme with purple/pink accents', emoji: '🧛' },
  { id: 'nord',      name: 'Nord',      description: 'Cool arctic blues and greys',                emoji: '🧊' },
  { id: 'gruvbox',   name: 'Gruvbox',   description: 'Warm retro earth tones',                    emoji: '🪵' },
  { id: 'solarized', name: 'Solarized', description: 'Ethan Schoonover\'s precision colors',      emoji: '☀️' },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neon yellow/magenta on near-black',         emoji: '🌆' },
  { id: 'monokai',   name: 'Monokai',   description: 'Warm dark with vivid accents',              emoji: '🎨' },
  { id: 'retro',     name: 'Retro',     description: 'Amber CRT monitor vibes',                   emoji: '📺' },
]

const STORAGE_KEY = 'tjhirani-theme'

export function getThemeIds(): string[] {
  return THEMES.map(t => t.id)
}

export function getTheme(id: string): Theme | undefined {
  return THEMES.find(t => t.id === id)
}

export function applyTheme(id: string): boolean {
  const theme = getTheme(id)
  if (!theme) return false
  document.documentElement.setAttribute('data-theme', id)
  localStorage.setItem(STORAGE_KEY, id)
  return true
}

export function loadSavedTheme(): string {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && getTheme(saved)) {
    applyTheme(saved)
    return saved
  }
  applyTheme('matrix')
  return 'matrix'
}

export function getCurrentTheme(): string {
  return document.documentElement.getAttribute('data-theme') ?? 'matrix'
}
