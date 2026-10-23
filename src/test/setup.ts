import '@testing-library/jest-dom'

// ============================================================
// CampusFix — Test Setup
// Provides a working localStorage mock so the safeStorage
// abstraction (captured at module load) can persist reports
// during tests. Mirrors the real localStorage API.
// ============================================================

const createLocalStorageMock = () => {
  const store = new Map<string, string>()
  return {
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): void => {
      store.set(key, String(value))
    },
    removeItem: (key: string): void => {
      store.delete(key)
    },
    key: (index: number): string | null => {
      const keys = Array.from(store.keys())
      return keys[index] ?? null
    },
    clear: (): void => {
      store.clear()
    },
    get length(): number {
      return store.size
    },
  }
}

Object.defineProperty(window, 'localStorage', {
  value: createLocalStorageMock(),
  configurable: true,
  writable: true,
})
