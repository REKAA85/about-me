// The intro reads the clock and the clock picks the theme.
//
// Four bands, one per icon in the Figma set. Sunset and night take the dark
// ground; sunrise and day take the light one.
export const BANDS = [
  { id: 'sunrise', from: 5, to: 9, dark: false },
  { id: 'day', from: 9, to: 17, dark: false },
  { id: 'sunset', from: 17, to: 20, dark: true },
  { id: 'night', from: 20, to: 5, dark: true },
]

export function timeBand(date = new Date()) {
  const h = date.getHours()
  // night wraps midnight, so it is the fallthrough rather than a range test
  const band = BANDS.find((b) => b.from < b.to && h >= b.from && h < b.to)
  return band ? band.id : 'night'
}

export function isDarkBand(band) {
  const found = BANDS.find((b) => b.id === band)
  return found ? found.dark : true
}

export function themeForTime(date = new Date()) {
  return isDarkBand(timeBand(date)) ? 'dark' : 'light'
}

// "8:00pm" / "12:30pm" — the frames use a right single quote in "It’s", which
// the caller supplies; this returns the clock portion only.
export function formatClock(date = new Date()) {
  const h = date.getHours()
  const m = date.getMinutes()
  const suffix = h < 12 ? 'am' : 'pm'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')}${suffix}`
}
