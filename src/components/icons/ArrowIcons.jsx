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
