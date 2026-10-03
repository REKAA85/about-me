import { useEffect, useRef } from 'react'

// Writes --px / --py (roughly -1..1) onto the returned element. Layers below
// it multiply those by their own --depth, so one pointer position drives the
// whole stack and the parallax maths stays in CSS.
//
// The value eases toward the pointer rather than tracking it exactly, and a
// slow Lissajous drift is added on top so the scene keeps breathing when the
// pointer is still.
export function usePointerParallax(active = true) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !active) return undefined

    let raf = 0
    let last = 0
    let elapsed = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const onMove = (event) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1
      targetY = (event.clientY / window.innerHeight) * 2 - 1
    }

    const frame = (now) => {
      // Clamp dt so returning from a background tab does not jump the drift.
      if (!last) last = now
      elapsed += Math.min(now - last, 50)
      last = now

      const t = elapsed / 1000
      const driftX = Math.sin(t * 0.22) * 0.16
      const driftY = Math.cos(t * 0.17) * 0.12

      currentX += (targetX - currentX) * 0.06
      currentY += (targetY - currentY) * 0.06

      el.style.setProperty('--px', (currentX + driftX).toFixed(4))
      el.style.setProperty('--py', (currentY + driftY).toFixed(4))
      raf = requestAnimationFrame(frame)
    }

    const play = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const pause = () => {
      cancelAnimationFrame(raf)
      raf = 0
      last = 0
    }
    const onVisibility = () => (document.hidden ? pause() : play())

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    play()

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
      pause()
      el.style.removeProperty('--px')
      el.style.removeProperty('--py')
    }
  }, [active])

  return ref
}
