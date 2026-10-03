import { useEffect, useState } from 'react'

// Shortest the chip is ever on screen, so a warm cache does not flash it.
const MIN_VISIBLE_MS = 700
// Hard ceiling: a stalled or broken asset must never strand the visitor on
// the loading screen.
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

// 'loading' -> 'opening' -> 'ready'. The corner accents travel during
// 'opening'; 'ready' just marks the sequence finished.
export function useBootSequence(sources, travelMs) {
  const [phase, setPhase] = useState('loading')

  useEffect(() => {
    let cancelled = false
    const startedAt = performance.now()

    const open = () => {
      if (cancelled) return
      const held = performance.now() - startedAt
      const wait = Math.max(0, MIN_VISIBLE_MS - held)
      setTimeout(() => {
        if (!cancelled) setPhase('opening')
      }, wait)
    }

    const fonts = document.fonts ? document.fonts.ready : Promise.resolve()
    const everything = Promise.all([...sources.map(preload), fonts])
    const safety = new Promise((resolve) => setTimeout(resolve, SAFETY_MS))

    Promise.race([everything, safety]).then(open)

    return () => {
      cancelled = true
    }
  }, [sources])

  useEffect(() => {
    if (phase !== 'opening') return undefined
    const id = setTimeout(() => setPhase('ready'), travelMs)
    return () => clearTimeout(id)
  }, [phase, travelMs])

  return phase
}
