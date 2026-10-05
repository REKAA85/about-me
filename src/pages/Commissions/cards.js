// The sample cards are built from the files in assets/commissions/cards —
// each card is a pair named "<Name> Front.png" and "<Name> Back.png". The
// back is the artwork side, so it is the face the viewer opens on; the front
// carries the card's details.
//
// Each face is re-encoded at build time by vite-imagetools: a small thumb for
// the samples row and a larger copy that the 3D viewer uses as its texture.
// The files keep their transparent bleed and rounded corners; the viewer reads
// the card's real outline back off the alpha channel.
const thumbs = import.meta.glob('/src/assets/commissions/cards/*.png', {
  eager: true,
  import: 'default',
  query: { h: '480', format: 'webp' },
})

const fulls = import.meta.glob('/src/assets/commissions/cards/*.png', {
  eager: true,
  import: 'default',
  query: { w: '1024', format: 'webp' },
})

// Your own card leads the row and is the one the viewer opens on.
const FEATURED = 'REKAA'

const byName = new Map()
for (const path of Object.keys(fulls)) {
  const match = path.match(/([^/]+?)\s+(front|back)\.png$/i)
  if (!match) continue
  const [, name, side] = match
  const card = byName.get(name) ?? { id: name, name }
  card[side.toLowerCase()] = { thumb: thumbs[path], full: fulls[path] }
  byName.set(name, card)
}

export const CARDS = [...byName.values()]
  .filter((card) => card.front && card.back)
  .sort((a, b) => (b.name === FEATURED) - (a.name === FEATURED) || a.name.localeCompare(b.name))
