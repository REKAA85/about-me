import { useEffect, useRef, useState } from 'react'

// `hold` is how long this line waits after the previous one — pacing slows
// down as things start to go wrong, for tension before the crash.
const LINES = [
  { tag: 'INIT', text: 'checking version...', hold: 220 },
  { tag: 'INIT', text: 'version checked: v7.23.26', hold: 240 },
  { tag: 'OK', text: 'profile loaded', hold: 220 },
  { tag: 'OK', text: 'channels synced', hold: 200 },
  { tag: 'WARN', text: 'anomaly detected', hold: 320 },
  { tag: 'ERROR', text: 'signal corrupted', hold: 460 },
  { tag: 'ERROR', text: 'critical failure // reality lost', hold: 560 },
]

const HOLD_AFTER = 200
const GLITCH_DURATION = 750
const LEAVE_DURATION = 650

// Per-character scatter offsets, computed once so they stay put across
// re-renders instead of jumping to new random values every reveal tick.
function scatterChars(text) {
  return [...text].map((ch) => ({
    ch: ch === ' ' ? ' ' : ch,
    dx: (Math.random() - 0.5) * 160,
    dy: (Math.random() - 0.5) * 90,
    rot: (Math.random() - 0.5) * 130,
    delay: Math.random() * 140,
  }))
}

const LINE_CHARS = LINES.map((line) => scatterChars(line.text))

// Cryptic binary/hex/status debris that pops up at random spots on screen
// during the glitch burst.
const POP_MESSAGES = [
  '01001000', '0x3F2A', 'NO SIGNAL', 'FRAME LOST', '11010010',
  'SYS//FAIL', '0xDEAD', 'DESYNC', '01100101', 'CHECKSUM ERR',
  '0x00FF', 'RETRY...',
]

const POPS = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  text: POP_MESSAGES[Math.floor(Math.random() * POP_MESSAGES.length)],
  top: Math.random() * 88 + 4,
  left: Math.random() * 84 + 4,
  delay: Math.random() * 460,
  dur: 280 + Math.random() * 260,
}))

export default function BootIntro({ onDone }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [glitching, setGlitching] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const hasError = LINES.slice(0, visibleCount).some((line) => line.tag === 'ERROR')

  // Line-by-line reveal, then the log "errors out" into a glitch burst
  // before wiping away to reveal the page.
  useEffect(() => {
    if (reducedMotion.current) {
      onDone()
      return
    }

    const timers = []
    let elapsed = 0
    LINES.forEach((line, i) => {
      elapsed += line.hold
      timers.push(setTimeout(() => setVisibleCount(i + 1), elapsed))
    })
    timers.push(setTimeout(() => setGlitching(true), elapsed + HOLD_AFTER))
    timers.push(setTimeout(() => setLeaving(true), elapsed + HOLD_AFTER + GLITCH_DURATION))

    function skip() {
      setGlitching(true)
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
    <div
      className={`boot${hasError && !glitching ? ' is-erroring' : ''}${glitching ? ' is-glitching' : ''}${leaving ? ' is-leaving' : ''}`}
      aria-hidden="true"
    >
      <div className="boot__panel boot__panel--top" />
      <div className="boot__panel boot__panel--bottom" />
      <div className="boot__content">
        <div className="boot__log">
          {LINES.slice(0, visibleCount).map((line, i) => (
            <p
              key={i}
              className={`boot__line boot__line--${line.tag.toLowerCase()}`}
              data-text={`[${line.tag}] ${line.text}`}
            >
              <span className="boot__line-tag">[{line.tag}]</span>
              <span className="boot__line-text">
                {LINE_CHARS[i].map((c, ci) => (
                  <span
                    key={ci}
                    className="boot__char"
                    style={{
                      '--dx': `${c.dx}px`,
                      '--dy': `${c.dy}px`,
                      '--rot': `${c.rot}deg`,
                      '--cdelay': `${c.delay}ms`,
                    }}
                  >
                    {c.ch}
                  </span>
                ))}
              </span>
            </p>
          ))}
        </div>
        <div className="boot__bar">
          <span style={{ width: `${(visibleCount / LINES.length) * 100}%` }} />
        </div>
        <p className="boot__skip">press any key to skip</p>
      </div>
      <div className="boot__noise" />
      <div className="boot__scan" />
      {glitching && (
        <div className="boot__pops">
          {POPS.map((p) => (
            <span
              key={p.id}
              className="boot__pop"
              style={{
                top: `${p.top}%`,
                left: `${p.left}%`,
                '--pdelay': `${p.delay}ms`,
                '--pdur': `${p.dur}ms`,
              }}
            >
              {p.text}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
