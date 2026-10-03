import { ArrowRight } from "@/components/icons/ArrowIcons";
import "./ArtArchiveStyle.scss";

// Placeholder until the archive itself is built. It carries the home page's
// two corner marks so the page transition has something that holds still —
// see the view-transition rules in styles/global.scss.
export default function ArtArchive({ onBack }) {
  return (
    <main className="archive">
      <button
        type="button"
        className="archive__corner archive__corner--tl"
        onClick={onBack}
        aria-label="Back to home"
      >
        <ArrowRight className="archive__back-icon" />
      </button>
      <span className="archive__corner archive__corner--br" aria-hidden="true" />

      <div className="archive__content">
        <p className="archive__marker">ART OF REKAA</p>
        <h1 className="archive__title">Art Archive</h1>
        <p className="archive__wip">
          WIP<span className="archive__cursor" aria-hidden="true">_</span>
        </p>
        <p className="archive__note">Work in progress — check back soon.</p>
      </div>
    </main>
  );
}
