import { useCallback, useEffect, useState } from "react";
import HomeArt from "./HomeArt";
import { ArrowDownRight, ArrowRight } from "./icons/ArrowIcons";
import { BrandIcon } from "./icons/BrandIcons";
import { BOOT_IMAGES, wordmark } from "./heroImages";
import { useBootSequence } from "../hooks/useBootSequence";

// Keep in sync with $boot-travel in _home.scss — how long the corner accents
// take to reach their corners.
const TRAVEL_MS = 820;

// Markers and labels are the frame's own copy (nodes 1101:60 / 1101:69 /
// 1101:103). Links carries the four rails drawn in Figma (1101:168, :177,
// :185, :313) in their numbered order.
//
// Figma does not draw rails for Services, so its two entries come from the
// support links the previous site shipped — placeholder hrefs included.
const SECTIONS = [
  {
    id: "links",
    marker: "STREAM / SOCIAL MEDIA",
    label: "Links",
    items: [
      { icon: "twitch", label: "Twitch", href: "https://twitch.tv/rekaa_85" },
      { icon: "twitter", label: "Twitter", href: "https://x.com/REKAA_85" },
      {
        icon: "discord",
        label: "Discord",
        href: "https://discord.gg/fsbWy5En3c",
      },
      {
        icon: "youtube",
        label: "YouTube",
        href: "https://www.youtube.com/@rekaa_85",
      },
    ],
  },
  {
    id: "services",
    marker: "COMMISSIONS / DONATE",
    label: "Services",
    // TODO: real Throne / Ko-fi URLs once they exist.
    items: [
      { icon: "throne", label: "Throne", href: "#" },
      { icon: "kofi", label: "Ko-fi", href: "#" },
    ],
  },
  { id: "art-archive", marker: "ART OF REKAA", label: "Art Archive" },
];

export default function Home({ onNavigate }) {
  const phase = useBootSequence(BOOT_IMAGES, TRAVEL_MS);
  const booting = phase === "loading";
  const [openId, setOpenId] = useState(null);
  const open = SECTIONS.find((s) => s.id === openId) ?? null;

  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    if (!openId) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, close]);

  function handleSelect(section) {
    // Sections with rails expand in place; the rest hand off to the router.
    if (!section.items) {
      onNavigate?.(section.id);
      return;
    }
    setOpenId((current) => (current === section.id ? null : section.id));
  }

  return (
    <main className={`home is-${phase}${open ? " is-expanded" : ""}`}>
      {!booting && <HomeArt />}

      {/* These two are the loading chip and the corner marks both. During
          'loading' they sit merged at the centre; the sequence just lets them
          travel to the corners they already belong to. */}
      <span className="home__corner home__corner--tl" aria-hidden="true" />
      <span className="home__corner home__corner--br" aria-hidden="true" />

      {phase === "opening" && (
        <span className="home__discharge" aria-hidden="true" />
      )}

      {phase !== "ready" && (
        <p className="home__boot" role="status">
          Loading
          <span className="home__boot-caret" aria-hidden="true" />
        </p>
      )}

      {!booting && (
        <>
          <p className="home__meta">
            VARIETY STREAMER / VTUBER / DESIGNER / SOFTWARE ENGINEER
          </p>

          <div className="home__content">
            <h1 className="home__title">
              <img
                className="home__wordmark"
                src={wordmark}
                alt="REKAA_85"
                width="1600"
                height="314"
                fetchPriority="high"
              />
            </h1>

            <p className="home__subtitle">
              <ArrowDownRight className="home__subtitle-icon" />
              <span>- Rogue Test Subject</span>
            </p>

            <nav className="home__nav" aria-label="Primary">
              {SECTIONS.map((section, i) => {
                const isOpen = openId === section.id;
                const dimmed = openId !== null && !isOpen;
                return (
                  <button
                    key={section.id}
                    type="button"
                    style={{
                      // --i drives the absolute row position, so an expanding bar
                      // stays exactly where its row was.
                      "--i": i,
                      // Character counts let CSS derive each string's width, which
                      // is what makes the slide to right-aligned animatable. Safe
                      // because the face is monospace — see _home.scss.
                      "--marker-len": section.marker.length,
                      "--label-len": section.label.length,
                    }}
                    className={`home__nav-item${isOpen ? " is-open" : ""}${dimmed ? " is-dimmed" : ""}`}
                    aria-expanded={section.items ? isOpen : undefined}
                    tabIndex={dimmed ? -1 : undefined}
                    onClick={() => handleSelect(section)}
                  >
                    {/* The status mark. On select it stretches out into the bar. */}
                    <span className="home__nav-fill" aria-hidden="true" />
                    <span className="home__nav-cube" aria-hidden="true" />
                    <span className="home__nav-marker">{section.marker}</span>
                    <span className="home__nav-label">{section.label}</span>
                    {/* One arrow for both states: it travels into the cube and
                    flips to point back. */}
                    <ArrowRight className="home__nav-icon" />
                  </button>
                );
              })}

              {open && (
                <ul
                  className="home__drop"
                  style={{ "--i": SECTIONS.indexOf(open) }}
                >
                  {open.items.map((item, i) => (
                    <li
                      key={item.label}
                      className="home__drop-row"
                      style={{ "--j": i }}
                    >
                      <a
                        className="home__drop-item"
                        data-brand={item.icon}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <BrandIcon
                          name={item.icon}
                          className="home__drop-icon"
                        />
                        <span className="home__drop-label">{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
          </div>
        </>
      )}
    </main>
  );
}
