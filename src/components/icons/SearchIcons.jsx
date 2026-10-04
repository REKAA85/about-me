// Magnifier for the Art Archive search's red end mark. The Figma search
// (node 1164:182) draws the mark empty; this fills it so it reads as search.
export function SearchIcon({ className }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21L16 16" />
    </svg>
  )
}
