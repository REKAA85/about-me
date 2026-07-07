import { useState } from 'react'
import Background from './components/Background'
import BootIntro from './components/BootIntro'
import IdCard from './components/IdCard'
import SocialLinks from './components/SocialLinks'
import Footer from './components/Footer'
import ArtGallery from './components/ArtGallery'
// import TwitchEmbed from './components/TwitchEmbed'

const BOOT_KEY = 'rekaa-booted'

// Edit this block to update the site's content.
const PROFILE = {
  handle: 'ROGUE TEST SUBJECT',
  role: 'Variety / FPS Streamer',
  tag: 'VTUBER / STREAMER',
  about:
    'The name is Rekaa (reh-kah). I am a variety streamer and VTuber. I play a lot of FPS games, but I also enjoy other genres. I stream on Twitch constantly and love interacting with my friends and chatters!',
}

const LINKS = [
  { id: 'twitch', label: 'Twitch', handle: 'twitch.tv/rekaa_85', href: 'https://twitch.tv/rekaa_85' },
  { id: 'youtube', label: 'YouTube', handle: '@rekaa_85', href: 'https://www.youtube.com/@rekaa_85' },
  { id: 'twitter', label: 'Twitter / X', handle: '@REKAA_85', href: 'https://x.com/REKAA_85' },
  { id: 'discord', label: 'Discord', handle: 'Join My Discord', href: 'https://discord.gg/fsbWy5En3c' },
]

// TODO: swap in real Throne / Ko-fi URLs once they exist.
const SUPPORT_LINKS = [
  { id: 'throne', label: 'Throne', handle: 'Wishlist', href: '#' },
  { id: 'kofi', label: 'Ko-fi', handle: 'Buy me a coffee', href: '#' },
]

export default function App() {
  const [booting, setBooting] = useState(() => sessionStorage.getItem(BOOT_KEY) !== 'true')
  const [scene, setScene] = useState('profile')
  const [liveStatus, setLiveStatus] = useState('Offline')

  function handleTwitchStatus(status) {
    setLiveStatus(status === 'online' ? 'Online' : 'Offline')
  }

  function handleBootDone() {
    sessionStorage.setItem(BOOT_KEY, 'true')
    setBooting(false)
  }

  return (
    <>
      <Background />
      {booting && <BootIntro onDone={handleBootDone} />}
      <main
        className={`page ${scene === 'gallery' ? 'page--gallery' : ''} ${scene === 'profile' ? 'page--returning' : ''}`}
        inert={booting ? '' : undefined}
      >
        {scene === 'gallery' ? (
          <div className="page__gallery-shell">
            <div className="page__gallery-top">
              <div className="page__gallery-intro">
                <p className="page__gallery-eyebrow">// archive</p>
                <h1 className="page__gallery-title">Art Gallery</h1>
                <p className="page__gallery-copy">
                  Collection of art of me and many more!
                </p>
              </div>
              <button type="button" className="page__toggle" onClick={() => setScene('profile')}>
                Return to profile
              </button>
            </div>
            <ArtGallery />
          </div>
        ) : (
          <>
            {/* <TwitchEmbed channel="rekaa_85" onStatusChange={handleTwitchStatus} /> */}
            <div className="page__layout">
              <div className="page__primary">
                <IdCard {...PROFILE} status={liveStatus} />
                <section className="page__toggle-section" aria-label="Art archives toggle">
                  <h2 className="page__side-heading">// Art Archives</h2>
                  <button type="button" className="page__toggle" onClick={() => setScene('gallery')}>
                    Enter art grid
                  </button>
                </section>
              </div>
              <div className="page__side">
                <section className="page__about" aria-label="About Me">
                  <h2 className="page__side-heading">// About Me</h2>
                  <p className="page__about-text">{PROFILE.about}</p>
                </section>
                <div className="page__channels">
                  <h2 className="page__side-heading">// Channels</h2>
                  <SocialLinks links={LINKS} />
                </div>
                <div className="page__support">
                  <h2 className="page__side-heading">// Support Me</h2>
                  <SocialLinks links={SUPPORT_LINKS} />
                </div>
              </div>
            </div>
          </>
        )}
        <Footer />
      </main>
    </>
  )
}
