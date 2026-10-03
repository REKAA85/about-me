import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// ---------------------------------------------------------------------------
// GitHub Pages base path:
// - User/org page (yourname.github.io)      -> base: '/'
// - Project page (github.com/you/repo-name)  -> base: '/repo-name/'
// Update the value below once the repo is created, then redeploy.
// ---------------------------------------------------------------------------
export default defineConfig({
  base: '/about-me/',
  plugins: [react(), imagetools()],
  resolve: {
    // '@' is the src root, so a page three folders deep still imports shared
    // code as '@/hooks/...' rather than '../../../hooks/...'.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
