import { useEffect, useRef } from 'react'

// Staggered build-in for everything marked data-reveal inside the returned
// ref. Each element gets .is-in the first time it scrolls into view and keeps
// it; the stylesheet decides what that looks like. Elements that arrive in
// the same batch are staggered by STEP, so a row builds left to right.
//
// The first batch is held back by ENTRY_DELAY so it plays as the page wipe
// (styles/global.scss) passes over, rather than finishing underneath it.
const STEP = 70
const MAX_STAGGER = 700
const ENTRY_DELAY = 240

export function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const targets = ref.current.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'))
      return
    }

    let base = ENTRY_DELAY
    const observer = new IntersectionObserver(
      (entries) => {
        let n = 0
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const delay = base + Math.min(n++ * STEP, MAX_STAGGER)
          entry.target.style.setProperty('--reveal-delay', `${delay}ms`)
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }
        if (n) base = 0
      },
      { rootMargin: '0px 0px -6% 0px' },
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return ref
}
