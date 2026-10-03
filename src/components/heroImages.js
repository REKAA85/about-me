// The artwork the boot sequence waits on, in back-to-front paint order.
// Shared so the preloader and HomeArt can never drift apart.
import blueFlame from '../assets/character/hero-blue-flame.webp'
import lightning3 from '../assets/character/hero-lightning-3.webp'
import lightning2 from '../assets/character/hero-lightning-2.webp'
import character from '../assets/character/hero-character.webp'
import lightning1 from '../assets/character/hero-lightning-1.webp'
import wordmark from '../assets/brand/wordmark-dark.webp'

export { blueFlame, lightning3, lightning2, character, lightning1, wordmark }

export const BOOT_IMAGES = [wordmark, blueFlame, lightning3, lightning2, character, lightning1]
