import { useState } from 'react'
import Background from './components/Background'
import BootIntro from './components/BootIntro'
import IdCard from './components/IdCard'
import SocialLinks from './components/SocialLinks'
import Footer from './components/Footer'

const BOOT_KEY = 'rekaa-booted'

// Edit this block to update the site's content.
const PROFILE = {
  handle: 'ROGUE TEST SUBJECT',
  role: 'Variety / FPS Streamer',
  status: 'Offline', // 'Online' | 'Offline t' 
  tag: 'VTUBER / STREAMER',
}

const LINKS = [
  { id: 'twitch', label: 'Twitch', handle: 'twitch.tv/rekaa_85', href: 'https://twitch.tv/rekaa_85' },
  { id: 'youtube', label: 'YouTube', handle: '@rekaa_85', href: 'https://www.youtube.com/@rekaa_85' },
  { id: 'twitter', label: 'Twitter / X', handle: '@REKAA_85', href: 'https://x.com/REKAA_85' },
]

export default function App() {
  const [booting, setBooting] = useState(() => sessionStorage.getItem(BOOT_KEY) !== 'true')

  function handleBootDone() {
    sessionStorage.setItem(BOOT_KEY, 'true')
    setBooting(false)
  }

  return (
    <>
      <Background />
      {booting && <BootIntro onDone={handleBootDone} />}
      <main className="page" inert={booting ? '' : undefined}>
        <div className="page__layout">
          <IdCard {...PROFILE} />
          <div className="page__side">
            <h2 className="page__side-heading">// Channels</h2>
            <SocialLinks links={LINKS} />
          </div>
        </div>
        <Footer />
      </main>
    </>
  )
}
