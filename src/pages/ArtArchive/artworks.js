// The archive is built from the files in assets/art — dropping a file in that
// folder is all it takes to add a piece. Everything the page shows is read
// off the file name, as ' || '-separated parts:
//
//   Title || Artist.png                       a fan / commissioned piece
//   Title || Artist || *.jpg                  ...flagged NSFW (blurred until revealed)
//   Title || Artist || Reference Sheet.png    goes under Reference Sheets
//   1 || Title || Artist.png                  a leading number pins it, lowest first
//
// Stills are resized and re-encoded at build time by vite-imagetools: a thumb
// sized for the row (840px tall covers the largest row at 2x) and a larger
// copy for the lightbox. Neither is ever upscaled. GIFs bypass it — sharp
// would flatten them to their first frame — so they ship as-is and report
// their size once loaded.
const thumbs = import.meta.glob('/src/assets/art/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
  query: { h: '840', format: 'webp', as: 'img' },
})

const fulls = import.meta.glob('/src/assets/art/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
  query: { w: '2400', format: 'webp' },
})

const gifs = import.meta.glob('/src/assets/art/*.gif', {
  eager: true,
  import: 'default',
  query: '?url',
})

// The folder spells "unknown" a few ways; they all mean the same thing.
const UNKNOWN = /^u[nk]+w?n$/i

function parse(path) {
  const parts = path
    .split('/')
    .pop()
    .replace(/\.[^.]+$/, '')
    .split(' || ')
    .map((part) => part.trim())

  const order = /^\d+$/.test(parts[0]) ? Number(parts.shift()) : Infinity
  const nsfw = parts.at(-1) === '*'
  if (nsfw) parts.pop()
  const reference = parts.at(-1)?.toLowerCase() === 'reference sheet'
  if (reference) parts.pop()

  const [title, artist = 'Unknown'] = parts
  return {
    id: path,
    title,
    artist: UNKNOWN.test(artist) ? 'Unknown' : artist,
    order,
    nsfw,
    section: reference ? 'reference' : 'fan',
  }
}

const stills = Object.entries(thumbs).map(([path, thumb]) => ({
  ...parse(path),
  thumb: thumb.src,
  full: fulls[path],
  width: thumb.w,
  height: thumb.h,
}))

const animated = Object.entries(gifs).map(([path, src]) => ({
  ...parse(path),
  thumb: src,
  full: src,
  width: null,
  height: null,
}))

const byOrderThenTitle = (a, b) => a.order - b.order || a.title.localeCompare(b.title)

const all = [...stills, ...animated].sort(byOrderThenTitle)

export const SECTIONS = [
  { id: 'reference', label: 'Reference Sheets', items: all.filter((a) => a.section === 'reference') },
  { id: 'fan', label: 'Fan / Commissioned Art', items: all.filter((a) => a.section === 'fan') },
].filter((section) => section.items.length > 0)
