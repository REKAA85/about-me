import { useEffect, useMemo, useRef, useState } from 'react'
import CharacterArt from './CharacterArt'

const GLYPH_SIZE = 7

const pad = (n) => String(n).padStart(2, '0')

function formatTimestamp(date) {
  const datePart = `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`
  const timePart = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  return `${datePart} // ${timePart}`
}

// Deterministic pseudo-random fill pattern derived from a seed string, so the
// decorative "identity glyph" stays stable across renders instead of
// reshuffling — it's a nod to the QR/ID-card aesthetic, not a real code.
function makeGlyph(seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0
  }
  const cells = []
  for (let i = 0; i < GLYPH_SIZE * GLYPH_SIZE; i++) {
    h ^= h << 13
    h >>>= 0
    h ^= h >>> 17
    h ^= h << 5
    h >>>= 0
    cells.push(h % 5 < 2)
  }
  return cells
}

const isCorner = (i) => {
  const row = Math.floor(i / GLYPH_SIZE)
  const col = i % GLYPH_SIZE
  const inTL = row < 2 && col < 2
  const inTR = row < 2 && col >= GLYPH_SIZE - 2
  const inBL = row >= GLYPH_SIZE - 2 && col < 2
  return inTL || inTR || inBL
}

export default function IdCard({ handle, role, status, tag }) {
  const frameRef = useRef(null)
  const glyph = useMemo(() => makeGlyph(handle), [handle])
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  function handlePointerMove(e) {
    const frame = frameRef.current
    if (!frame || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = frame.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    frame.style.setProperty('--tilt-x', `${(-py * 6).toFixed(2)}deg`)
    frame.style.setProperty('--tilt-y', `${(px * 8).toFixed(2)}deg`)
  }

  function handlePointerLeave() {
    const frame = frameRef.current
    if (!frame) return
    frame.style.setProperty('--tilt-x', '0deg')
    frame.style.setProperty('--tilt-y', '0deg')
  }

  return (
    <section className="id-card" aria-label="Profile card">
      <div
        className="id-card__frame"
        ref={frameRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <header className="id-card__top">
          <div className="id-card__signal">
            <span className="id-card__crosshair">+</span>
            <span className="id-card__signal-label">
              SIGNAL // <span className={`status--${status.toLowerCase()}`}>{status}</span>
            </span>
          </div>
          <div className="id-card__wordmark">
            <span className="id-card__wordmark-mark">{formatTimestamp(now)}</span>
          </div>
        </header>

        <CharacterArt />

        <div className="id-card__body">
          <h1 className="id-card__name">
            {handle}
            <span className="id-card__cursor" aria-hidden="true">
              _
            </span>
          </h1>
          <dl className="id-card__fields">
            <div className="id-card__field">
              <dt>ID</dt>
              <dd>REKAA_85</dd>
            </div>
            <div className="id-card__field">
              <dt>Type</dt>
              <dd>{role}</dd>
            </div>
          </dl>
        </div>

        <footer className="id-card__bottom">
          <div className="id-card__chip" role="presentation">
            {glyph.map((filled, i) => (
              <span
                key={i}
                className={[
                  'id-card__cell',
                  filled ? 'is-filled' : '',
                  isCorner(i) ? 'is-corner' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{ '--delay': `${(i % GLYPH_SIZE) * 40 + Math.floor(i / GLYPH_SIZE) * 25}ms` }}
              />
            ))}
          </div>
          <div className="id-card__barcode" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} style={{ '--w': `${((i * 37) % 3) + 1}px` }} />
            ))}
          </div>
          <div className="id-card__tag">{tag}</div>
        </footer>
      </div>
    </section>
  )
}
