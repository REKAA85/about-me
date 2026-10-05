// Arrow glyphs from the Figma "Simple Design System" library (nodes 1096:1499
// and 1101:66). Inlined rather than shipped as files: both are a single
// stroked path, and inlining lets them inherit colour from CSS.
//
// Geometry — viewBox, path data, stroke width, caps — is copied verbatim from
// the exported SVGs. Only the hard-coded #E22F24 became currentColor.

export function ArrowDownRight({ className }) {
  return (
    <svg
      className={className}
      width="34.8354"
      height="34.8354"
      viewBox="0 0 34.8354 34.8354"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.90295"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M10.1603 10.1603L24.6751 24.6751M10.1603 24.6751H24.6751V10.1603" />
    </svg>
  )
}

export function ArrowRight({ className }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12H19M12 19L19 12L12 5" />
    </svg>
  )
}

// Arrow down (node 1169:614) and the 48px chevrons (1169:1996 and its mirror),
// from the same library, for the Commissions page.
export function ArrowDown({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 3.33333V12.6667M3.33333 8L8 12.6667L12.6667 8" />
    </svg>
  )
}

export function Chevron({ direction = 'left', className }) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={direction === 'left' ? 'M30 36L18 24L30 12' : 'M18 36L30 24L18 12'} />
    </svg>
  )
}
