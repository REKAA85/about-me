import Home from '@/pages/Home/Home'
import ArtArchive from '@/pages/ArtArchive/ArtArchive'
import Commissions from '@/pages/Commissions/Commissions'
import { useHashRoute } from '@/hooks/useHashRoute'

export default function App() {
  const [route, navigate] = useHashRoute()

  // The Links / Services screens are still to come; until a section has a
  // page of its own, selecting it just logs in development.
  function handleNavigate(section) {
    if (section === 'art-archive' || section === 'commissions') {
      navigate(section)
      return
    }
    if (import.meta.env.DEV) {
      console.info(`[nav] "${section}" has no destination yet`)
    }
  }

  if (route === 'art-archive') {
    return <ArtArchive onBack={() => navigate('')} />
  }

  if (route === 'commissions') {
    return <Commissions onBack={() => navigate('')} />
  }

  return <Home onNavigate={handleNavigate} />
}
