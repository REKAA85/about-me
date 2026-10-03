import Home from '@/pages/Home/Home'

export default function App() {
  // The Links / Services / Art Archive screens are the next pieces of the
  // rebuild; the masthead is already wired for them.
  function handleNavigate(section) {
    if (import.meta.env.DEV) {
      console.info(`[nav] "${section}" has no destination yet`)
    }
  }

  return <Home onNavigate={handleNavigate} />
}
