import { useMemo, useState } from 'react'

const artModules = import.meta.glob('../assets/art/*.{svg,png,jpg,jpeg,webp,gif}', {
  eager: true,
  import: 'default',
})

function formatDisplayName(value) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function parseArtworkTitle(title) {
  const baseTitle = title.replace(/\.[^.]+$/, '')
  const parts = baseTitle
    .split('||')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) {
    return { name: formatDisplayName(baseTitle), artistName: null }
  }

  return {
    name: formatDisplayName(parts[0]),
    artistName: parts.length > 1 ? formatDisplayName(parts.slice(1).join(' || ')) : null,
  }
}

const ARTWORKS = Object.entries(artModules).map(([path, image]) => {
  const fileName = path.split('/').pop() || path
  const title = fileName.replace(/\.[^.]+$/, '')

  return {
    id: fileName,
    title,
    image,
    ...parseArtworkTitle(title),
  }
})

export default function ArtGallery() {
  const [query, setQuery] = useState('')

  const filteredArtworks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return ARTWORKS

    return ARTWORKS.filter(({ name, artistName, title }) => {
      const haystack = [name, artistName, title].filter(Boolean).join(' ').toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [query])

  return (
    <section className="art-gallery" aria-label="Art gallery">
      <div className="art-gallery__header">
        <div>
          <p className="art-gallery__eyebrow">// scene shift</p>
          <h2 className="art-gallery__title">Interactive Art Grid</h2>
        </div>
        <label className="art-gallery__search" htmlFor="art-search">
          <span className="art-gallery__search-label">Search</span>
          <input
            id="art-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name or artist"
          />
        </label>
      </div>

      <div className="art-gallery__grid">
        {filteredArtworks.map(({ id, title, name, artistName, image }) => (
          <article className="art-gallery__card" key={id}>
            <img className="art-gallery__image" src={image} alt={title} />
            <div className="art-gallery__meta">
              <h3 className="art-gallery__name">{name}</h3>
              {artistName ? <p className="art-gallery__artist">by {artistName}</p> : null}
              <p className="art-gallery__hint">Hover to inspect</p>
            </div>
          </article>
        ))}
      </div>

      {filteredArtworks.length === 0 && <p className="art-gallery__empty">No matches in the current signal.</p>}
    </section>
  )
}
