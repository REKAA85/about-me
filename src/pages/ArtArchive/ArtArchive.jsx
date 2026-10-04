import { useLayoutEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowRight } from "@/components/icons/ArrowIcons";
import { AlertTriangle } from "@/components/icons/AlertIcons";
import { TimeIcon } from "@/components/icons/TimeIcons";
import { useTheme } from "@/hooks/useTheme";
import { useReveal } from "@/hooks/useReveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { SECTIONS } from "./artworks";
import "./ArtArchiveStyle.scss";

// The Art Archive — Figma node 1148:139. A section per kind of piece, each a
// wrapping row of cards held to one height, so every piece keeps its own
// proportions. The pieces themselves come from assets/art; see artworks.js.
//
// It carries the home page's two corner marks so the page transition has
// something that holds still — see the view-transition rules in
// styles/global.scss. The bottom-right one is the theme switch, as on Home.
//
// Everything marked data-reveal builds in as it first comes into view — the
// first screen as the wipe brings the page in, the rest as it is scrolled to.
export default function ArtArchive({ onBack }) {
  const { theme, toggle: toggleTheme } = useTheme();
  const [open, setOpen] = useState(null);
  const contentRef = useReveal();

  return (
    <main className="archive">
      <button
        type="button"
        className="archive__corner archive__corner--tl"
        onClick={onBack}
        aria-label="Back to home"
      >
        <ArrowRight className="archive__corner-icon archive__corner-icon--back" />
      </button>
      <button
        type="button"
        className="archive__corner archive__corner--br"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        <TimeIcon band={theme === "dark" ? "night" : "day"} className="archive__corner-icon" />
      </button>

      <div className="archive__content" ref={contentRef}>
        <h1 className="archive__title" data-reveal>
          <ArrowDownRight className="archive__title-arrow" />
          <span>- Art Archive</span>
        </h1>

        {SECTIONS.map((section, i) => (
          <section key={section.id} className="archive__section" aria-labelledby={`archive-${section.id}`}>
            {i > 0 && <hr className="archive__rule" data-reveal />}
            <h2 id={`archive-${section.id}`} className="archive__tag" data-reveal>
              {section.label}
              {i === 0 && (
                <span className="archive__cursor" aria-hidden="true">
                  _
                </span>
              )}
            </h2>
            <ul className="archive__grid">
              {section.items.map((art) => (
                <ArtCard
                  key={art.id}
                  art={art}
                  onOpen={(origin, ar) => setOpen({ art, origin, ar })}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Lightbox open={open} onClosed={() => setOpen(null)} />
    </main>
  );
}

// A card's frame takes its width from the piece's aspect ratio and the row
// height. Stills know their size from the build; GIFs learn it on load and
// sit square until then.
//
// An NSFW piece always sits under the blurred cover in the grid. Clicking it
// opens the lightbox still covered; the reveal happens there.
//
// The frame hands itself to onOpen, so the lightbox can grow out of it.
function ArtCard({ art, onOpen }) {
  const [size, setSize] = useState(art.width ? [art.width, art.height] : null);

  function handleLoad(event) {
    if (size) return;
    const img = event.currentTarget;
    setSize([img.naturalWidth, img.naturalHeight]);
  }

  const ar = size ? `${size[0]} / ${size[1]}` : "1";

  return (
    <li className="art" style={{ "--ar": ar }} data-reveal>
      <figure className="art__figure">
        <button
          type="button"
          className={`art__frame${art.nsfw ? " is-covered" : ""}`}
          onClick={(event) => onOpen(event.currentTarget, ar)}
          aria-label={`View ${art.nsfw ? "NSFW piece " : ""}${art.title} by ${art.artist}`}
        >
          <img
            className="art__img"
            src={art.thumb}
            width={size?.[0]}
            height={size?.[1]}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={handleLoad}
          />
          {art.nsfw && (
            <span className="art__cover">
              <span>NSFW Content</span>
              <AlertTriangle className="art__cover-icon" />
            </span>
          )}
        </button>
        <figcaption className="art__caption">
          <span className="art__title">{art.title}</span>
          <span className="art__artist">Artist: {art.artist}</span>
        </figcaption>
      </figure>
    </li>
  );
}

// The full piece in a native modal <dialog>, which brings focus trapping for
// free. It grows out of the card that opened it and shrinks back into it on
// the way out: the piece is laid out at its final size, then animated from
// the card's box with a transform (FLIP), so the morph never triggers layout.
// The card is hidden meanwhile, so it reads as lifting out of the grid.
//
// The thumb is already in cache, so it is painted under the full-size image
// as a placeholder — the morph never shows an empty box while that loads.
//
// Escape, the backdrop and the close button all go through requestClose so
// they animate; the close event is the backstop that tidies up however the
// dialog actually ends up closed.
const MORPH_IN = { duration: 560, easing: "cubic-bezier(0.16, 1, 0.3, 1)" };
const MORPH_OUT = { duration: 380, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" };

function morph(origin, piece, options, reverse) {
  const a = origin.getBoundingClientRect();
  const b = piece.getBoundingClientRect();
  const frames = [
    {
      transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`,
    },
    { transform: "none" },
  ];
  return piece.animate(reverse ? frames.reverse() : frames, options).finished;
}

function Lightbox({ open, onClosed }) {
  const ref = useRef(null);
  const pieceRef = useRef(null);
  const closing = useRef(false);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (!open) return;
    ref.current.showModal();
    open.origin.style.visibility = "hidden";
    if (!reduced) morph(open.origin, pieceRef.current, MORPH_IN);
  }, [open]);

  async function requestClose() {
    if (!open || closing.current) return;
    closing.current = true;
    ref.current.classList.add("is-closing");
    if (!reduced) {
      await morph(open.origin, pieceRef.current, MORPH_OUT, true).catch(() => {});
    }
    ref.current.close();
  }

  function handleClose() {
    closing.current = false;
    ref.current.classList.remove("is-closing");
    if (open) open.origin.style.visibility = "";
    onClosed();
  }

  return (
    <dialog
      ref={ref}
      className="lightbox"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClose={handleClose}
      onClick={(event) => event.target === event.currentTarget && requestClose()}
      aria-label={open ? `${open.art.title} by ${open.art.artist}` : undefined}
    >
      {open && (
        <figure className="lightbox__figure">
          <div ref={pieceRef} className="lightbox__piece" style={{ "--ar": open.ar }}>
            {/* Keyed so every opening of an NSFW piece starts covered again. */}
            <LightboxPiece key={open.art.id} art={open.art} />
          </div>
          <figcaption className="lightbox__caption">
            <span className="art__title">{open.art.title}</span>
            <span className="art__artist">Artist: {open.art.artist}</span>
          </figcaption>
        </figure>
      )}
      <button type="button" className="lightbox__close" onClick={requestClose} aria-label="Close">
        <ArrowRight className="archive__corner-icon archive__corner-icon--back" />
      </button>
    </dialog>
  );
}

// An NSFW piece is two copies of the same image stacked: a blurred one under
// the cover, and a sharp one on top that is clipped away. Revealing sweeps
// the sharp copy in along the site's -45deg wipe (the same cut as the page
// transitions) while the cover lifts off.
function LightboxPiece({ art }) {
  const [revealed, setRevealed] = useState(!art.nsfw);
  const alt = `${art.title} by ${art.artist}`;

  if (!art.nsfw) {
    return (
      <img
        className="lightbox__img"
        src={art.full}
        alt={alt}
        style={{ backgroundImage: `url("${art.thumb}")` }}
      />
    );
  }

  return (
    <div className={`lightbox__stage${revealed ? " is-revealed" : ""}`}>
      <img
        className="lightbox__img lightbox__img--blurred"
        src={art.full}
        alt=""
        aria-hidden="true"
        style={{ backgroundImage: `url("${art.thumb}")` }}
      />
      <img className="lightbox__img lightbox__img--sharp" src={art.full} alt={alt} />
      <button
        type="button"
        className="lightbox__cover"
        onClick={() => setRevealed(true)}
        disabled={revealed}
        aria-label="Reveal NSFW piece"
      >
        <span>NSFW Content</span>
        <AlertTriangle className="lightbox__cover-icon" />
        <span className="lightbox__hint">Click to reveal</span>
      </button>
    </div>
  );
}
