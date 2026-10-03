import { blueFlame, lightning3, lightning2, character, lightning1 } from '../heroImages'
import { usePointerParallax } from '@/hooks/usePointerParallax'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import './HomeArtStyle.scss'

// Parallax is pointer-driven, so it is switched off entirely where there is
// no fine pointer. That also keeps the rAF loop — and the compositing cost of
// five large layers — off phones and tablets, which gain nothing from it.
function useDepthEnabled() {
  const reduced = usePrefersReducedMotion()
  const finePointer =
    typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
  return !reduced && finePointer
}

// The Home Page artwork: a rotated red band with the character plate stacked
// over it. Layer order is back-to-front exactly as in Figma (node 1105:126).
// The frame's "portal" and "crystals" layers are hidden in the design and so
// are deliberately absent here.
//
// Each layer carries a --depth in the stylesheet; the pointer offset written
// here is multiplied by it, which separates the flat stack into a diorama.
// The band deliberately stays put — it reads as the wall behind the scene.
//
// Purely decorative — the page's meaning lives in the content block.
export default function HomeArt() {
  const ref = usePointerParallax(useDepthEnabled())

  return (
    <div className="home__art" ref={ref} aria-hidden="true">
      <div className="home__band" />
      <div className="home__figure">
        <img className="home__layer home__layer--flame" src={blueFlame} alt="" decoding="async" />
        <img className="home__layer home__layer--bolt-3" src={lightning3} alt="" decoding="async" />
        <img className="home__layer home__layer--bolt-2" src={lightning2} alt="" decoding="async" />
        <div className="home__layer home__layer--char">
          <img
            className="home__char-plate"
            src={character}
            alt=""
            decoding="async"
            fetchPriority="high"
          />
        </div>
        <img className="home__layer home__layer--bolt-1" src={lightning1} alt="" decoding="async" />
      </div>
    </div>
  )
}
