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
}

export default function SocialLinks({ links }) {
  return (
    <ul className="social-links">
      {links.map(({ id, label, href, handle }) => {
        const isLive = href !== '#'
        return (
          <li key={id}>
            <a
              className="social-links__item"
              href={href}
              target={isLive ? '_blank' : undefined}
              rel={isLive ? 'noreferrer noopener' : undefined}
              aria-disabled={!isLive}
              onClick={(e) => {
                if (!isLive) e.preventDefault()
              }}
            >
              <span className="social-links__icon">{ICONS[id]}</span>
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
