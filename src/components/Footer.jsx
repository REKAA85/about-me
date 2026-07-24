const TICKER_ITEMS = ['VARIETY', 'FPS', 'VTUBER', 'LIVE ON TWITCH']

export default function Footer() {
  const track = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <footer className="site-footer">
      <div className="site-footer__ticker" aria-hidden="true">
        <div className="site-footer__track">
          {track.map((item, i) => (
            <span key={i}>
              {item}
              <i />
            </span>
          ))}
        </div>
      </div>
      <p className="site-footer__copy">&copy; 2026 REKAA_85 — AI TRAINING IS PROHIBITED</p>
    </footer>
  )
}
