import { useCallback, useEffect, useState } from "react";
import HomeArt from "./HomeArt/HomeArt";
import { ArrowDownRight, ArrowRight } from "@/components/icons/ArrowIcons";
import { NavIcon } from "@/components/icons/NavIcons";
import { BrandIcon } from "@/components/icons/BrandIcons";
import { BOOT_IMAGES, WORDMARK } from "./heroImages";
import { useBootSequence } from "@/hooks/useBootSequence";
import { useTheme } from "@/hooks/useTheme";
import { TimeIcon, bandLabel } from "@/components/icons/TimeIcons";
import { timeBand, formatClock } from "@/lib/timeOfDay";
import "./HomeStyle.scss";

// Keep in sync with $boot-travel in styles/_variables.scss — how long the corner accents
// take to reach their corners.
const TRAVEL_MS = 820;

// The intro plays once per visit. Home unmounts when another page opens, so
// this lives outside the component to survive the trip back.
let introPlayed = false;

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
    glyph: "link",
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
    glyph: "edit",
    // TODO: real Throne / Ko-fi URLs once they exist.
    items: [
      { icon: "throne", label: "Throne", href: "#" },
      { icon: "kofi", label: "Ko-fi", href: "#" },
    ],
  },
  { id: "art-archive", marker: "ART OF REKAA", label: "Art Archive", glyph: "image" },
];

export default function Home({ onNavigate }) {
  const [skipIntro] = useState(() => introPlayed);
  const phase = useBootSequence(BOOT_IMAGES, TRAVEL_MS, skipIntro);
  const { theme, toggle: toggleTheme } = useTheme();
  // Frozen at mount so the clock shown in the intro cannot tick mid-sequence.
  const [now] = useState(() => new Date());
  const band = timeBand(now);
  // The page proper mounts with the split, not before it.
  const booting = phase !== "opening" && phase !== "ready";
  // The icon arrives with the time stage and stays on as the toggle's face.
  const showIcon = phase !== "loading" && phase !== "welcome";
  // Through the intro it marks the time of day; once the toggle goes live it
  // shows the theme instead — sun for light, moon for dark.
  const cornerIcon = phase === "ready" ? (theme === "dark" ? "night" : "day") : band;
  const clock = formatClock(now);
  const [openId, setOpenId] = useState(null);
  const open = SECTIONS.find((s) => s.id === openId) ?? null;

  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    if (phase === "ready") introPlayed = true;
  }, [phase]);

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

      {/* These two are the intro chip and the corner marks both. Through
          'loading' / 'welcome' / 'time' they sit merged at the centre as one
          chip — --switch is its right-hand icon square, --body its body —
          and the split simply lets each fly to the corner it becomes:
          --switch to the bottom-right, --body to the top-left. Nothing is
          swapped or re-mounted, so there is no seam.

          --switch is also the theme switch. Its face is the time-of-day icon
          until the sequence ends, then the sun or moon for the current
          theme. It stays disabled until then, so it is neither focusable nor
          clickable while still in flight. */}
      <button
        type="button"
        className="home__corner home__corner--switch"
        onClick={toggleTheme}
        disabled={phase !== "ready"}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        title={`${bandLabel(band)} — ${clock}`}
      >
        {showIcon && <TimeIcon band={cornerIcon} className="home__corner-icon" />}
      </button>
      <span className="home__corner home__corner--body" aria-hidden="true" />

      {phase === "opening" && (
        <span className="home__discharge" aria-hidden="true" />
      )}

      {/* All three lines are mounted at once and crossfaded by the stage
          class, which is what lets one word hand over to the next instead of
          cutting. Inactive lines go visibility:hidden once faded, so they
          leave the accessibility tree too. */}
      {booting && (
        <p className="home__boot" aria-live="polite">
          <span className="home__boot-line" data-stage="loading">
            Loading
            {/* Each dot keeps its space and only its opacity cycles, so the
                line stays the 118px the frame draws and nothing reflows. */}
            <span className="home__boot-dots" aria-hidden="true">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </span>
          <span className="home__boot-line" data-stage="welcome">
            Welcome.
          </span>
          <span className="home__boot-line" data-stage="time">
            {`It\u2019s ${clock}`}
          </span>
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
                src={WORDMARK[theme]}
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
                      // because the face is monospace — see HomeStyle.scss.
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
                    {/* The section glyph at rest; the back arrow once open.
                    Both travel into the cube and cross-fade on the way. */}
                    <NavIcon
                      name={section.glyph}
                      className="home__nav-icon home__nav-glyph"
                    />
                    <ArrowRight className="home__nav-icon home__nav-back" />
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
