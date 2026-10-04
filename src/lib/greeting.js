import { GREETING_BANDS, FALLBACK_LINES, GREETING_HOLD } from '@/config/greetings'
import { formatClock } from '@/lib/timeOfDay'

function inBand(hour, { from, to }) {
  // A band whose end is before its start wraps past midnight.
  return from <= to ? hour >= from && hour < to : hour >= from || hour < to
}

// Picks the intro greeting for a moment in time — see config/greetings.js.
// Returns the text and how long the intro should hold it.
export function pickGreeting(date = new Date()) {
  const hour = date.getHours() + date.getMinutes() / 60
  const band = GREETING_BANDS.find((b) => inBand(hour, b) && b.lines?.length)
  const pool = band ? band.lines : FALLBACK_LINES
  const line = pool[Math.floor(Math.random() * pool.length)]

  const text = line
    .replaceAll('{clock}', formatClock(date))
    .replaceAll('{day}', date.toLocaleDateString('en-US', { weekday: 'long' }))

  const { base, perCharacter, max } = GREETING_HOLD
  const holdMs = Math.min(max, base + text.length * perCharacter)
  return { text, holdMs }
}
