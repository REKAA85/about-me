import { useEffect, useRef, useState } from 'react'

const PARENT_DOMAINS = [
  'rekaa85.github.io',
  'localhost',
  'super-duper-palm-tree-4qqw74wr7gp43j96q-5173.app.github.dev',
]

const EMBED_SCRIPT_SRC = 'https://embed.twitch.tv/embed/v1.js'

function loadEmbedScript() {
  if (window.Twitch?.Embed) return Promise.resolve()
  const existing = document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)
  if (existing) {
    return new Promise((resolve) => existing.addEventListener('load', resolve, { once: true }))
  }
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = EMBED_SCRIPT_SRC
    script.async = true
    script.onload = resolve
    document.body.appendChild(script)
  })
}

// Twitch's Embed SDK reports real ONLINE/OFFLINE state via the player itself,
// so live status here reflects the actual stream — no API key required.
export default function TwitchEmbed({ channel, onStatusChange }) {
  const containerRef = useRef(null)
  const embedRef = useRef(null)
  const [status, setStatus] = useState('offline')

  useEffect(() => {
    onStatusChange?.(status)
  }, [status, onStatusChange])

  useEffect(() => {
    let cancelled = false

    loadEmbedScript().then(() => {
      if (cancelled || !containerRef.current || embedRef.current) return

      const embed = new window.Twitch.Embed(containerRef.current, {
        channel,
        parent: PARENT_DOMAINS,
        width: '100%',
        height: '100%',
        layout: 'video',
        autoplay: true,
        muted: true,
      })
      embedRef.current = embed

      embed.addEventListener(window.Twitch.Embed.VIDEO_READY, () => {
        if (cancelled) return
        const player = embed.getPlayer()
        player.addEventListener(window.Twitch.Player.ONLINE, () => setStatus('online'))
        player.addEventListener(window.Twitch.Player.OFFLINE, () => setStatus('offline'))
      })
    })

    return () => {
      cancelled = true
    }
  }, [channel])

  return (
    <section
      className={`page__live ${status === 'online' ? 'is-live' : 'is-hidden'}`}
      aria-label="Live Stream"
      aria-hidden={status !== 'online'}
    >
      <h2 className="page__side-heading">// Live</h2>
      <div className="twitch-embed" ref={containerRef} />
    </section>
  )
}
