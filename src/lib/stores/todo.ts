import { writable } from 'svelte/store'

// ── Todo Item ─────────────────────────────────────────────────────────────────

export interface TodoItem {
  id: number
  text: string
  done: boolean
  createdAt: string
}

const STORAGE_KEY = 'tjhirani-todos'

function loadTodos(): TodoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveTodos(todos: TodoItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function createTodoStore() {
  const { subscribe, update } = writable<TodoItem[]>(loadTodos())

  return {
    subscribe,

    add(text: string): TodoItem {
      let newItem!: TodoItem
      update(todos => {
        const id = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1
        newItem = { id, text: text.trim(), done: false, createdAt: new Date().toISOString() }
        const next = [...todos, newItem]
        saveTodos(next)
        return next
      })
      return newItem
    },

    complete(id: number): boolean {
      let found = false
      update(todos => {
        const next = todos.map(t => {
          if (t.id === id) { found = true; return { ...t, done: true } }
          return t
        })
        saveTodos(next)
        return next
      })
      return found
    },

    remove(id: number): boolean {
      let found = false
      update(todos => {
        const next = todos.filter(t => { if (t.id === id) { found = true; return false } return true })
        saveTodos(next)
        return next
      })
      return found
    },

    getAll(): TodoItem[] {
      let result: TodoItem[] = []
      // Svelte store trick: use subscribe with immediate call
      const unsub = this.subscribe(v => { result = v })
      unsub()
      return result
    },
  }
}

export const todoStore = createTodoStore()
