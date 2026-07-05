import portal from '../assets/character/portal.png'
import lightning3 from '../assets/character/lightning-3.png'
import lightning2 from '../assets/character/lightning-2.png'
import blueFlame from '../assets/character/blue-flame.png'
import lightning1 from '../assets/character/lightning-1.png'
import character from '../assets/character/character.png'
import crystals from '../assets/character/crystals.png'

// Stacked back-to-front: energy layers behind the character, crystal shards on top.
// All seven source files share one 5500x7000 canvas, so they align without any
// per-layer positioning.
const LAYERS = [
  { src: portal, kind: 'energy' },
  { src: blueFlame, kind: 'energy' },
  { src: lightning2, kind: 'energy' },
    { src: crystals, kind: 'accent' },
  { src: lightning3, kind: 'energy' },
  { src: character, kind: 'subject' },
  { src: lightning1, kind: 'energy' },

]

export default function CharacterArt() {
  return (
    <div className="character-art" aria-hidden="true">
      {LAYERS.map(({ src, kind }, i) => (
        <img
          key={i}
          className={`character-art__layer is-${kind}`}
          src={src}
          alt=""
          loading="lazy"
          style={{ '--delay': `${i * 0.6}s` }}
        />
      ))}
    </div>
  )
}
