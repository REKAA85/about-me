// The artwork the boot sequence waits on, in back-to-front paint order.
// Shared so the preloader and HomeArt can never drift apart.
import blueFlame from '@/assets/character/hero-blue-flame.webp'
import lightning3 from '@/assets/character/hero-lightning-3.webp'
import lightning2 from '@/assets/character/hero-lightning-2.webp'
import character from '@/assets/character/hero-character.webp'
import lightning1 from '@/assets/character/hero-lightning-1.webp'
// Two wordmarks, named for the ink rather than the theme: the dark-ink one
// sits on the light ground and vice versa.
import wordmarkDarkInk from '@/assets/brand/wordmark-dark.webp'
import wordmarkLightInk from '@/assets/brand/wordmark-light.webp'

export { blueFlame, lightning3, lightning2, character, lightning1 }
export { wordmarkDarkInk, wordmarkLightInk }

export const WORDMARK = { light: wordmarkDarkInk, dark: wordmarkLightInk }

// Both wordmarks are preloaded so toggling the theme never pops a blank slot.
export const BOOT_IMAGES = [
  wordmarkDarkInk,
  wordmarkLightInk,
  blueFlame,
  lightning3,
  lightning2,
  character,
  lightning1,
]
