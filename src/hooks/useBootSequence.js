import { useEffect, useState } from 'react'

// Shortest the Loading chip is ever on screen, so a warm cache does not flash
// it. The later stages are read, not waited on, so they get fixed holds.
const MIN_LOADING_MS = 650
const TIME_MS = 1700
// The chip folding down into a single square before the two halves diverge.
const COLLAPSE_MS = 560
// Hard ceiling on preloading: a stalled or broken asset must never strand the
// visitor on the loading screen.
const SAFETY_MS = 6000

function preload(src) {
  return new Promise((resolve) => {
    const img = new Image()
    // decode() too, so the reveal cannot stutter on a first paint.
    img.onload = () => (img.decode ? img.decode().then(resolve, resolve) : resolve())
    img.onerror = resolve
    img.src = src
  })
}

// 'loading' -> 'welcome' -> 'time' -> 'collapse' -> 'opening' -> 'ready'.
//
// The chip morphs through the first three. 'collapse' folds it down to a
// single square holding the mode icon — both halves stack exactly, so it
// reads as one — and 'opening' is where they diverge to their corners.
// 'ready' just marks the end.
//
// welcomeMs is how long the greeting holds; it varies with the line picked.
//
// With skip set the sequence starts at 'ready' — used when the visitor comes
// back to home from another page and has already sat through it once.
export function useBootSequence(sources, travelMs, skip = false, welcomeMs = 1150) {
  const [phase, setPhase] = useState(skip ? 'ready' : 'loading')

  useEffect(() => {
    if (skip) return undefined
    let cancelled = false
    const startedAt = performance.now()

    const advance = () => {
      if (cancelled) return
      const wait = Math.max(0, MIN_LOADING_MS - (performance.now() - startedAt))
      setTimeout(() => {
        if (!cancelled) setPhase('welcome')
      }, wait)
    }

    const fonts = document.fonts ? document.fonts.ready : Promise.resolve()
    const everything = Promise.all([...sources.map(preload), fonts])
    const safety = new Promise((resolve) => setTimeout(resolve, SAFETY_MS))
    Promise.race([everything, safety]).then(advance)

    return () => {
      cancelled = true
    }
  }, [sources, skip])

  useEffect(() => {
    const next = {
      welcome: ['time', welcomeMs],
      time: ['collapse', TIME_MS],
      collapse: ['opening', COLLAPSE_MS],
      opening: ['ready', travelMs],
    }[phase]
    if (!next) return undefined
    const id = setTimeout(() => setPhase(next[0]), next[1])
    return () => clearTimeout(id)
  }, [phase, travelMs, welcomeMs])

  return phase
}
