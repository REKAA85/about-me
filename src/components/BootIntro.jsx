import { useEffect, useRef, useState } from 'react'

const LINES = [
  { tag: 'INIT', text: 'booting rekaa_85 terminal' },
  { tag: 'INIT', text: 'establishing signal uplink' },
  { tag: 'OK', text: 'profile loaded' },
  { tag: 'OK', text: 'channels synced' },
  { tag: 'READY', text: 'welcome' },
]

const LINE_DELAY = 260
const HOLD_AFTER = 500
const LEAVE_DURATION = 650

export default function BootIntro({ onDone }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  // Line-by-line reveal, then a short hold before wiping to the page.
  useEffect(() => {
    if (reducedMotion.current) {
      onDone()
      return
    }

    const timers = LINES.map((_, i) =>
      setTimeout(() => setVisibleCount(i + 1), LINE_DELAY * (i + 1)),
    )
    timers.push(setTimeout(() => setLeaving(true), LINE_DELAY * LINES.length + HOLD_AFTER))

    function skip() {
      setLeaving(true)
    }
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)

    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Once the wipe starts, hand control back after the CSS transition finishes.
  useEffect(() => {
    if (!leaving) return
    const t = setTimeout(onDone, LEAVE_DURATION)
    return () => clearTimeout(t)
  }, [leaving, onDone])

  if (reducedMotion.current) return null

  return (
    <div className={`boot${leaving ? ' is-leaving' : ''}`} aria-hidden="true">
      <div className="boot__panel boot__panel--top" />
      <div className="boot__panel boot__panel--bottom" />
      <div className="boot__content">
        <div className="boot__log">
          {LINES.slice(0, visibleCount).map((line, i) => (
            <p key={i} className={`boot__line boot__line--${line.tag.toLowerCase()}`}>
              <span className="boot__line-tag">[{line.tag}]</span>
              {line.text}
            </p>
          ))}
        </div>
        <div className="boot__bar">
          <span style={{ width: `${(visibleCount / LINES.length) * 100}%` }} />
        </div>
        <p className="boot__skip">press any key to skip</p>
      </div>
    </div>
  )
}
