// Alert triangle from the Figma "Simple Design System" library (node
// 1150:166), the mark on the Art Archive's NSFW cover. Inlined like the other
// icon sets; path data, stroke width and caps are verbatim from the export,
// with the hard-coded white swapped for currentColor.
export function AlertTriangle({ className }) {
  return (
    <svg
      className={className}
      width="39"
      height="39"
      viewBox="0 0 39 39"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M19.5 14.625V21.125M19.5 27.625H19.5163M16.7213 6.2725L2.9575 29.25C2.67372 29.7414 2.52357 30.2986 2.52198 30.8661C2.52039 31.4336 2.66742 31.9916 2.94844 32.4846C3.22946 32.9776 3.63468 33.3885 4.12378 33.6763C4.61287 33.9641 5.1688 34.1188 5.73625 34.125H33.2637C33.8312 34.1188 34.3871 33.9641 34.8762 33.6763C35.3653 33.3885 35.7705 32.9776 36.0516 32.4846C36.3326 31.9916 36.4796 31.4336 36.478 30.8661C36.4764 30.2986 36.3263 29.7414 36.0425 29.25L22.2788 6.2725C21.9891 5.79492 21.5812 5.40007 21.0944 5.12604C20.6077 4.852 20.0586 4.70804 19.5 4.70804C18.9414 4.70804 18.3923 4.852 17.9056 5.12604C17.4188 5.40007 17.0109 5.79492 16.7213 6.2725Z" />
    </svg>
  )
}
