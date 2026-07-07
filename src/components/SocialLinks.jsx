const ICONS = {
  twitch: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M4.3 2 2 7.3v13.1h5v2.6h3.3l2.6-2.6h4L22.6 15V2H4.3Zm16.3 12.1-3.3 3.3h-4l-2.6 2.6v-2.6H6.7V3.9h13.9v10.2Z" />
      <path d="M17.7 6.9h-1.9v5.7h1.9V6.9Zm-5.1 0h-1.9v5.7h1.9V6.9Z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M22.5 6.9a2.8 2.8 0 0 0-2-2C18.7 4.4 12 4.4 12 4.4s-6.7 0-8.5.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 5.1 2.8 2.8 0 0 0 2 2c1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-5.1ZM9.8 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M18.9 2.4h3.3l-7.3 8.3 8.6 11.4h-6.7l-5.3-6.9-6 6.9H2.1l7.8-8.9L1.7 2.4h6.9l4.8 6.3 5.5-6.3Zm-1.2 17.6h1.8L7.4 4.3H5.5l12.2 15.7Z" />
    </svg>
  ),
  discord: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M20.3 5.3A18 18 0 0 0 15.7 4a12.6 12.6 0 0 0-.6 1.2 16.7 16.7 0 0 0-5 0A12.6 12.6 0 0 0 9.5 4a18 18 0 0 0-4.6 1.4C1.9 9.6 1.2 13.7 1.5 17.8a18.1 18.1 0 0 0 5.5 2.8c.4-.6.8-1.3 1.1-2a11.7 11.7 0 0 1-1.8-.9l.4-.3a12.9 12.9 0 0 0 11 0l.4.3c-.6.3-1.2.6-1.8.9.3.7.7 1.4 1.1 2a18 18 0 0 0 5.5-2.8c.4-4.7-.8-8.8-3.6-12.5ZM8.7 15.3c-.9 0-1.7-.9-1.7-2s.7-2 1.7-2 1.8.9 1.7 2c0 1.1-.8 2-1.7 2Zm6.6 0c-.9 0-1.7-.9-1.7-2s.7-2 1.7-2 1.8.9 1.7 2c0 1.1-.7 2-1.7 2Z" />
    </svg>
  ),
  throne: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M3 8.2 7 11l5-6.6L17 11l4-2.8-2 10.8H5L3 8.2Zm2.7 3.1L7 17.2h10l1.3-5.9-2.7 1.9L12 8l-3.6 5.2-2.7-1.9ZM6 19h12v2H6v-2Z" />
    </svg>
  ),
  kofi: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M4 4h13a3.2 3.2 0 0 1 0 6.4h-1.1A5.1 5.1 0 0 1 11 15.4H8.4a4.4 4.4 0 0 1-4.4-4.4V4Zm13 2.1h-1v4.2h1a2.1 2.1 0 0 0 0-4.2ZM6.1 6.1v4.9a2.3 2.3 0 0 0 2.3 2.3H11a3 3 0 0 0 3-3V6.1H6.1ZM6 19.5h11v2H6v-2Z" />
    </svg>
  ),
}

export default function SocialLinks({ links }) {
  return (
    <ul className="social-links">
      {links.map(({ id, label, href, handle }) => {
        const isLive = href !== '#'
        return (
          <li key={id}>
            <a
              className={`social-links__item social-links__item--${id}`}
              href={href}
              target={isLive ? '_blank' : undefined}
              rel={isLive ? 'noreferrer noopener' : undefined}
              aria-disabled={!isLive}
              onClick={(e) => {
                if (!isLive) e.preventDefault()
              }}
            >
              <span className={`social-links__icon social-links__icon--${id}`}>{ICONS[id]}</span>
              <span className="social-links__text">
                <span className="social-links__label">{label}</span>
                <span className="social-links__handle">{handle}</span>
              </span>
              <span className="social-links__arrow" aria-hidden="true">
                &rarr;
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
