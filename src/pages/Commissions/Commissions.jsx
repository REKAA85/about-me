import { useState } from "react";
import { ArrowDown, ArrowRight, Chevron } from "@/components/icons/ArrowIcons";
import { BoxIcon } from "@/components/icons/BoxIcons";
import { TimeIcon } from "@/components/icons/TimeIcons";
import { useTheme } from "@/hooks/useTheme";
import { useReveal } from "@/hooks/useReveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { CARDS } from "./cards";
import CardViewer from "./CardViewer";
import "./CommissionsStyle.scss";

// How many sample pairs the row shows at once (three in Figma).
const VISIBLE = 3;

// Commissions — Figma node 1169:545. The pitch for card commissions down the
// left, the samples row under it, and the selected sample in 3D on the right.
//
// Laid out like the Art Archive, with its two corner marks in the same squares
// so the page transition has something that holds still.
export default function Commissions({ onBack }) {
  const { theme, toggle: toggleTheme } = useTheme();
  const reduced = usePrefersReducedMotion();
  const contentRef = useReveal();
  const [selected, setSelected] = useState(0);
  const [start, setStart] = useState(0);
  // null until the visitor picks: then it follows reduced motion.
  const [choice3d, setChoice3d] = useState(null);
  const show3d = choice3d ?? !reduced;
  const card = CARDS[selected];
  const lastStart = Math.max(CARDS.length - VISIBLE, 0);

  function select(index) {
    setSelected(index);
    // Keep the chosen pair in the visible window.
    setStart((s) => Math.min(Math.max(s, index - VISIBLE + 1), index, lastStart));
  }

  return (
    <main className="commissions">
      <button
        type="button"
        className="commissions__corner commissions__corner--tl"
        onClick={onBack}
        aria-label="Back to home"
      >
        <ArrowRight className="commissions__corner-icon commissions__corner-icon--back" />
      </button>
      <button
        type="button"
        className="commissions__corner commissions__corner--br"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        <TimeIcon band={theme === "dark" ? "night" : "day"} className="commissions__corner-icon" />
      </button>

      <div className="commissions__content" ref={contentRef}>
        <div className="commissions__info">
          <h1 className="commissions__title" data-reveal>
            <BoxIcon className="commissions__title-icon" />
            <span>- Commissions</span>
          </h1>

          <h2 className="commissions__tag" data-reveal>
            <span className="commissions__tag-mark" aria-hidden="true">
              <ArrowDown className="commissions__tag-icon" />
            </span>
            <span className="commissions__tag-label">Cards</span>
          </h2>

          <div className="commissions__copy" data-reveal>
            <h3 className="commissions__heading">[ Trading, Business, Advertisement ]</h3>
            <p>
              Designed on Figma and print ready for any printing service*! Each card is designed with theme in
              mind, with the provided art, assets, and ideas that come to mind. Whether it is trading themed, a
              basic business design, or something to share with friends, fans, and more.
            </p>
          </div>

          <div className="commissions__copy commissions__copy--note" data-reveal>
            <h3 className="commissions__heading">[ NOTE ]</h3>
            <ul className="commissions__notes">
              <li>I do not create or draw art. You will need to provide your artwork and any assets needed.</li>
              <li>
                I do not provide any printing services. I can recommend you services but you will need to provide
                the artwork to 3rd party services.
              </li>
            </ul>
          </div>

            <div className="commissions__copy commissions__copy--note" data-reveal>
            <h3 className="commissions__heading">[ Contact & Info ]</h3>
            <p>
              If you're interested, please DM me on discord (rekaa_85). From there I can handle
              any inquiry.
            </p>
          </div>

          <section className="samples" aria-labelledby="samples-label" data-reveal>
            <h3 id="samples-label" className="samples__label">
              [ SAMPLES ]
            </h3>
            <div className="samples__row">
              <button
                type="button"
                className="samples__nav"
                onClick={() => setStart((s) => Math.max(s - 1, 0))}
                disabled={start === 0}
                aria-label="Previous samples"
              >
                <Chevron direction="left" className="samples__chevron" />
              </button>
              <div className="samples__window">
                <ul className="samples__track" style={{ "--start": start }}>
                  {CARDS.map((sample, i) => (
                    <li key={sample.id} className="samples__item" inert={i < start || i >= start + VISIBLE ? "" : undefined}>
                      <button
                        type="button"
                        className={`sample${i === selected ? " is-selected" : ""}`}
                        onClick={() => select(i)}
                        aria-pressed={i === selected}
                        aria-label={`Show the ${sample.name} card`}
                      >
                        <img className="sample__face sample__face--front" src={sample.front.thumb} alt="" />
                        <img className="sample__face sample__face--back" src={sample.back.thumb} alt="" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                className="samples__nav"
                onClick={() => setStart((s) => Math.min(s + 1, lastStart))}
                disabled={start >= lastStart}
                aria-label="Next samples"
              >
                <Chevron direction="right" className="samples__chevron" />
              </button>
            </div>
          </section>
        </div>

        <section className="viewer" aria-label={`${card.name} card`} data-reveal>
          <div className="viewer__slot">
            {show3d ? (
              <CardViewer
                card={card}
                still={reduced}
                label={`${card.name} card in 3D. Drag to rotate; arrow keys turn it over.`}
              />
            ) : (
              <FlatCard key={card.id} card={card} />
            )}
          </div>
          <div className="viewer__controls">
            <p className="viewer__hint">{show3d ? "[ Click and hold to rotate ]" : "[ Click to flip ]"}</p>
            <button
              type="button"
              className={`viewer__toggle${show3d ? " is-on" : ""}`}
              onClick={() => setChoice3d(!show3d)}
              aria-pressed={show3d}
              aria-label="3D view"
            >
              3D
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

// The 2D card: both faces stacked back to back, turned over with a CSS flip.
function FlatCard({ card }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      className={`flat${flipped ? " is-flipped" : ""}`}
      onClick={() => setFlipped((f) => !f)}
      aria-label={`Turn the ${card.name} card over`}
    >
      <img className="flat__face" src={card.back.full} alt={`${card.name} card, art side`} />
      <img className="flat__face flat__face--front" src={card.front.full} alt={`${card.name} card, details side`} />
    </button>
  );
}
