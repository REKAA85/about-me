import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

// Hash routing, so a reload on GitHub Pages never asks the server for a path
// it does not have. '#/art-archive' -> 'art-archive'; no hash is home ('').
function readRoute() {
  return window.location.hash.replace(/^#\/?/, '')
}

// Swaps the page inside a View Transition when the browser has one. The
// direction goes on <html> for the duration so global.scss can play the wipe
// forwards (into a page) or backwards (out to home). Browsers without the API
// just swap.
function withTransition(direction, update) {
  if (!document.startViewTransition) {
    update()
    return
  }
  const root = document.documentElement
  root.dataset.nav = direction
  const transition = document.startViewTransition(() => flushSync(update))
  transition.finished.finally(() => {
    delete root.dataset.nav
  })
}

export function useHashRoute() {
  const [route, setRoute] = useState(readRoute)

  // Every change goes through the hash, so the browser's back and forward
  // buttons animate exactly like the in-page links do.
  useEffect(() => {
    const onHashChange = () => {
      const next = readRoute()
      withTransition(next ? 'forward' : 'back', () => setRoute(next))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((to) => {
    window.location.hash = `/${to}`
  }, [])

  return [route, navigate]
}
