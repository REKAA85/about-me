// ---------------------------------------------------------------------------
// Intro greetings — the line the intro chip shows where it used to say
// "Welcome.". One is picked at random from whichever band the visitor's
// local time falls in.
//
// Bands
//   from / to   Hours on a 24h clock, `to` exclusive. Decimals work for
//               minutes (17.5 is 5:30pm). A band may wrap past midnight
//               (from: 22, to: 3). Bands are checked top to bottom and the
//               first match wins, so a narrow band listed above a wide one
//               carves a slot out of it.
//   lines       The pool to pick from. Anything from one word to a short
//               sentence; long lines wrap and the chip grows to fit them.
//
// Placeholders, filled in when the line is shown:
//   {clock}  the time, e.g. 8:05pm
//   {day}    the weekday, e.g. Friday
//
// These bands only choose the greeting. The theme and the time-of-day icon
// follow their own bands in src/lib/timeOfDay.js.
// ---------------------------------------------------------------------------
export const GREETING_BANDS = [
  {
    id: 'late-night',
    from: 2,
    to: 7,
    lines: ['Why are you up?', 'Go back to sleep.', 'Go to bed.', 'You shouldnt be awake...'],
  },
  {
    id: 'morning',
    from: 7,
    to: 10.5,
    lines: ['Good morning.', 'Rise and shine.', 'Coffee first.', 'Still sleepy?'],
  },
  {
    id: 'mid-day',
    from: 10.5,
    to: 15,
    lines: ['Welcome.', 'Hello there.', 'How are ya?', 'Happy {day}.'],
  },
  {
    id: 'afternoon',
    from: 15,
    to: 17,
    lines: ['Day is almost over.', 'Hey there.', 'Good afternoon.', 'Happy {day}.'],
  },
  {
    id: 'evening',
    from: 17,
    to: 20,
    lines: ['Good evening.', 'Came from my socials?', 'Hey there.', 'Still loading...'],
  },
  {
    id: 'night',
    from: 20,
    to: 2,
    lines: ['Good evening.', 'Have a wonderful night!', 'The day has ended.', 'Its getting late?'],
  },
]

// Used when no band matches the current time.
export const FALLBACK_LINES = ['Welcome.']

// How long the greeting stays up, in ms: `base` plus `perCharacter` for each
// character, capped at `max`. "Welcome." gets about the 1.1s it always had.
export const GREETING_HOLD = { base: 750, perCharacter: 45, max: 3200 }
