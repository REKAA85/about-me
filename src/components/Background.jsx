import wordmark from '../assets/brand/wordmark.png'

// Purely decorative, fixed backdrop: dot grid, diagonal red wedge,
// a giant faint watermark logo, and a slow scanline sweep.
// Everything here is aria-hidden — it carries no content.
export default function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__grid" />
      <div className="bg__wedge" />
      <img className="bg__watermark" src={wordmark} alt="" />
      <div className="bg__scanline" />
      <div className="bg__vignette" />
    </div>
  )
}
