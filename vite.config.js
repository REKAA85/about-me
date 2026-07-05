import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ---------------------------------------------------------------------------
// GitHub Pages base path:
// - User/org page (yourname.github.io)      -> base: '/'
// - Project page (github.com/you/repo-name)  -> base: '/repo-name/'
// Update the value below once the repo is created, then redeploy.
// ---------------------------------------------------------------------------
export default defineConfig({
  base: '/about-me',
  plugins: [react()],
})
