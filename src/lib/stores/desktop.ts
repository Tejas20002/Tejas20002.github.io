import { writable } from 'svelte/store';

export type AppId = 'terminal' | 'projects' | 'settings' | 'contact';

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const STORAGE_KEY = 'tjhirani-desktop-v4';

function loadState() {
  if (typeof localStorage === 'undefined') return null;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        windows: [],
        activeWindowId: null,
        nextZIndex: 10
      };
    } catch (e) {
      console.error('Failed to load desktop state', e);
    }
  }
  return null;
}

function saveState(state: any) {
  if (typeof localStorage === 'undefined') return;
  const toSave = { ...state, windows: [], activeWindowId: null };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

function createDesktopStore() {
  const savedState = loadState();
  const initialState = savedState || {
    windows: [],
    activeWindowId: null,
    nextZIndex: 10,
    config: {
      dockPosition: 'bottom' as 'bottom' | 'left' | 'right',
      dockSize: 1,
      dockAutoHide: false,
      wallpaper: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=2560&q=80'
    },
    iconPositions: {} as Record<string, { x: number, y: number }>
  };

  const { subscribe, update } = writable(initialState);

  return {
    subscribe,
    updateConfig: (updates: Partial<{ dockPosition: 'bottom' | 'left' | 'right', dockSize: number, dockAutoHide: boolean, wallpaper: string }>) => 
      update(s => {
        const next = { ...s, config: { ...s.config, ...updates } };
        saveState(next);
        return next;
      }),
    updateIconPosition: (id: string, pos: { x: number, y: number }) =>
      update(s => {
        const next = { ...s, iconPositions: { ...s.iconPositions, [id]: pos } };
        saveState(next);
        return next;
      }),
    openWindow: (appId: AppId, title: string) => update(s => {
      const existing = s.windows.find(w => w.appId === appId);
      if (existing) {
        return {
          ...s,
          activeWindowId: existing.id,
          windows: s.windows.map(w => w.id === existing.id ? { ...w, isMinimized: false, zIndex: s.nextZIndex } : w),
          nextZIndex: s.nextZIndex + 1
        };
      }

      const id = Math.random().toString(36).substr(2, 9);
      // Terminal opens maximized, other apps open as large windows
      const isTerminal = appId === 'terminal';
      const newWindow: WindowInstance = {
        id,
        appId,
        title,
        isOpen: true,
        isMinimized: false,
        isMaximized: isTerminal,
        zIndex: s.nextZIndex,
        x: 80 + (s.windows.length * 30),
        y: 60 + (s.windows.length * 30),
        width: 900,
        height: 580
      };

      return {
        ...s,
        windows: [...s.windows, newWindow],
        activeWindowId: id,
        nextZIndex: s.nextZIndex + 1
      };
    }),
    closeWindow: (id: string) => update(s => ({
      ...s,
      windows: s.windows.filter(w => w.id !== id),
      activeWindowId: s.activeWindowId === id ? (s.windows[s.windows.length - 2]?.id || null) : s.activeWindowId
    })),
    focusWindow: (id: string) => update(s => ({
      ...s,
      activeWindowId: id,
      windows: s.windows.map(w => w.id === id ? { ...w, zIndex: s.nextZIndex } : w),
      nextZIndex: s.nextZIndex + 1
    })),
    updateWindow: (id: string, updates: Partial<WindowInstance>) => update(s => ({
      ...s,
      windows: s.windows.map(w => w.id === id ? { ...w, ...updates } : w)
    })),
    toggleMinimize: (id: string) => update(s => ({
      ...s,
      windows: s.windows.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)
    })),
    toggleMaximize: (id: string) => update(s => ({
      ...s,
      windows: s.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
    })),
    minimizeAll: () => update(s => ({
      ...s,
      windows: s.windows.map(w => ({ ...w, isMinimized: true }))
    })),
    closeAll: () => update(s => ({
      ...s,
      windows: [],
      activeWindowId: null
    })),
    unminimizeAll: () => update(s => ({
      ...s,
      windows: s.windows.map(w => ({ ...w, isMinimized: false }))
    }))
  };
}

export const desktop = createDesktopStore();
