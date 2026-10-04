import { TIME_ICON_PATHS } from '@/components/icons/TimeIcons'
import { timeBand } from '@/lib/timeOfDay'

// The tab icon follows the clock: the intro's time-of-day mark, drawn as the
// same red square with a white glyph. Built as an SVG data URI so there are
// no extra files, and re-checked each minute so an open tab rolls over from
// day to sunset on its own.
//
// It is added as a second <link> after the PNG in index.html rather than
// replacing it. Browsers that render SVG favicons take it; the rest (older
// Safari) keep the PNG.
const ACCENT = '#e22f24'
const CHECK_MS = 60_000

function iconFor(band) {
  // A 24px glyph centred on a 32px tile, stroked a touch heavier than the
  // on-page icon so it survives being drawn at 16px.
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 32 32">` +
    `<rect x="-4" y="-4" width="32" height="32" fill="${ACCENT}"/>` +
    `<path d="${TIME_ICON_PATHS[band]}" fill="none" stroke="#fff" stroke-width="2.75" ` +
    `stroke-linecap="round" stroke-linejoin="round"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function startBandFavicon() {
  const link = document.createElement('link')
  link.rel = 'icon'
  link.type = 'image/svg+xml'
  document.head.appendChild(link)

  let current = null
  const update = () => {
    const band = timeBand()
    if (band === current) return
    current = band
    link.href = iconFor(band)
  }

  update()
  setInterval(update, CHECK_MS)
}
