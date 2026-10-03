import { useCallback, useEffect, useState } from 'react'
import { themeForTime } from '@/lib/timeOfDay'

const SURFACE = { light: '#f1f1f1', dark: '#1d2024' }

// The clock decides the theme, and it decides again on every load — a manual
// toggle holds for the session but is deliberately not persisted. The inline
// script in index.html has already written the attribute before first paint,
// so the initial state is read back from there rather than recomputed.
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'light'
    const set = document.documentElement.dataset.theme
    return set === 'dark' || set === 'light' ? set : themeForTime()
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', SURFACE[theme])
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggle }
}
