import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

const artModules = import.meta.glob('../assets/art/*.{svg,png,jpg,jpeg,webp,gif}', {
  eager: true,
  import: 'default',
})

// Resized/re-encoded grid thumbnails — gif and svg are excluded so animation
// and vector fidelity aren't touched; the lightbox always uses the original.
const thumbnailModules = import.meta.glob('../assets/art/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
  query: '?w=480&format=webp&quality=75',
})

function formatDisplayName(value) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function parseArtworkTitle(title) {
  let baseTitle = title.replace(/\.[^.]+$/, '')

  const isNsfw = baseTitle.endsWith('*')
  if (isNsfw) baseTitle = baseTitle.slice(0, -1).trim()

  const parts = baseTitle
    .split('||')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) {
    return { name: formatDisplayName(baseTitle), artistName: null, rank: null, subsection: null, isNsfw }
  }

  let rest = parts
  let rank = null

  if (parts.length > 1 && /^\d+(\.\d+)?$/.test(parts[0])) {
    rank = Number(parts[0])
    rest = parts.slice(1)
  }

  return {
    name: formatDisplayName(rest[0]),
    artistName: rest.length > 1 ? formatDisplayName(rest[1]) : null,
    subsection: rest.length > 2 ? formatDisplayName(rest[2]) : null,
    rank,
    isNsfw,
  }
}

function ArtworkCard({ artwork, isRevealed, isFlashing, onReveal, onSelect, onFlashEnd }) {
  const { id, title, name, artistName, thumbnail, isNsfw } = artwork
  const isBlurred = isNsfw && !isRevealed

  return (
    <button
      type="button"
      className={`art-gallery__card${isBlurred ? ' art-gallery__card--nsfw' : ''}`}
      onClick={() => (isBlurred ? onReveal(id) : onSelect(id))}
    >
      <div className="art-gallery__image-wrap">
        <img
          className={`art-gallery__image${isBlurred ? ' art-gallery__image--blurred' : ''}`}
          src={thumbnail}
          alt={isBlurred ? 'Hidden NSFW artwork' : title}
          loading="lazy"
          decoding="async"
        />
        {isNsfw && (
          <div
            className={`art-gallery__nsfw-overlay${isRevealed ? ' art-gallery__nsfw-overlay--revealed' : ''}`}
          >
            <span className="art-gallery__nsfw-label">NSFW</span>
            <span className="art-gallery__nsfw-hint">Click to reveal</span>
          </div>
        )}
        {isNsfw && (
          <span
            className={`art-gallery__reveal-flash${isFlashing ? ' art-gallery__reveal-flash--active' : ''}`}
            onAnimationEnd={onFlashEnd}
          />
        )}
      </div>
      <div className="art-gallery__meta">
        <h3 className="art-gallery__name">{name}</h3>
        {artistName ? <p className="art-gallery__artist">by {artistName}</p> : null}
      </div>
    </button>
  )
}

const ARTWORKS = Object.entries(artModules)
  .map(([path, image]) => {
    const fileName = path.split('/').pop() || path
    const title = fileName.replace(/\.[^.]+$/, '')

    return {
      id: fileName,
      title,
      image,
      thumbnail: thumbnailModules[path] ?? image,
      ...parseArtworkTitle(title),
    }
  })
  .sort((a, b) => {
    if (a.rank === null && b.rank === null) return 0
    if (a.rank === null) return 1
    if (b.rank === null) return -1
    return a.rank - b.rank
  })

export default function ArtGallery() {
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState(null)
  const [revealedIds, setRevealedIds] = useState(() => new Set())
  const [flashId, setFlashId] = useState(null)
  const [isLightboxClosing, setIsLightboxClosing] = useState(false)

  const revealArtwork = useCallback((id) => {
    setRevealedIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setFlashId(id)
  }, [])

  const clearFlash = useCallback(() => setFlashId(null), [])

  const filteredArtworks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return ARTWORKS

    return ARTWORKS.filter(({ name, artistName, subsection, title }) => {
      const haystack = [name, artistName, subsection, title].filter(Boolean).join(' ').toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [query])

  const groupedArtworks = useMemo(() => {
    const ungrouped = []
    const order = []
    const map = new Map()

    filteredArtworks.forEach((artwork) => {
      if (!artwork.subsection) {
        ungrouped.push(artwork)
        return
      }
      if (!map.has(artwork.subsection)) {
        map.set(artwork.subsection, [])
        order.push(artwork.subsection)
      }
      map.get(artwork.subsection).push(artwork)
    })

    return { ungrouped, sections: order.map((key) => ({ key, items: map.get(key) })) }
  }, [filteredArtworks])

  const activeArtwork = useMemo(
    () => ARTWORKS.find((artwork) => artwork.id === activeId) ?? null,
    [activeId],
  )

  const openLightbox = useCallback((id) => {
    setIsLightboxClosing(false)
    setActiveId(id)
  }, [])

  const closeLightbox = useCallback(() => setIsLightboxClosing(true), [])

  const handleLightboxAnimationEnd = useCallback(
    (event) => {
      if (!isLightboxClosing || event.target !== event.currentTarget) return
      setActiveId(null)
      setIsLightboxClosing(false)
    },
    [isLightboxClosing],
  )

  useEffect(() => {
    if (!activeArtwork) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeLightbox()
    }

    document.addEventListener('keydown', handleKeyDown)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = overflow
    }
  }, [activeArtwork, closeLightbox])

  return (
    <section className="art-gallery" aria-label="Art gallery">
      <div className="art-gallery__header">
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

      {groupedArtworks.sections.map(({ key, items }) => (
        <div className="art-gallery__section" key={key}>
          <h3 className="art-gallery__section-title">{key}</h3>
          <div className="art-gallery__grid">
            {items.map((artwork) => (
              <ArtworkCard
                artwork={artwork}
                isRevealed={revealedIds.has(artwork.id)}
                isFlashing={flashId === artwork.id}
                onReveal={revealArtwork}
                onSelect={openLightbox}
                onFlashEnd={clearFlash}
                key={artwork.id}
              />
            ))}
          </div>
        </div>
      ))}

      {groupedArtworks.ungrouped.length > 0 && (
        <div className="art-gallery__section">
          <h3 className="art-gallery__section-title">Art</h3>
          <div className="art-gallery__grid">
            {groupedArtworks.ungrouped.map((artwork) => (
              <ArtworkCard
                artwork={artwork}
                isRevealed={revealedIds.has(artwork.id)}
                isFlashing={flashId === artwork.id}
                onReveal={revealArtwork}
                onSelect={openLightbox}
                onFlashEnd={clearFlash}
                key={artwork.id}
              />
            ))}
          </div>
        </div>
      )}

      {filteredArtworks.length === 0 && <p className="art-gallery__empty">No matches in the current signal.</p>}

      {activeArtwork &&
        createPortal(
          <div
            className={`art-gallery__lightbox${isLightboxClosing ? ' art-gallery__lightbox--closing' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={activeArtwork.name}
            onClick={closeLightbox}
            onAnimationEnd={handleLightboxAnimationEnd}
          >
            <button
              type="button"
              className="art-gallery__lightbox-close"
              onClick={closeLightbox}
              aria-label="Close"
            >
              ✕
            </button>
            <figure
              className={`art-gallery__lightbox-frame${isLightboxClosing ? ' art-gallery__lightbox-frame--closing' : ''}`}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                className="art-gallery__lightbox-image"
                src={activeArtwork.image}
                alt={activeArtwork.title}
                decoding="async"
              />
              <figcaption className="art-gallery__lightbox-caption">
                <h3 className="art-gallery__name">{activeArtwork.name}</h3>
                {activeArtwork.artistName ? (
                  <p className="art-gallery__artist">by {activeArtwork.artistName}</p>
                ) : null}
              </figcaption>
            </figure>
          </div>,
          document.body,
        )}
    </section>
  )
}
