import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GH Pages project sites are served from /<repo-name>/, so the deploy
  // workflow overrides the base via VITE_BASE. Local dev/preview stay on "/".
  base: process.env.VITE_BASE ?? '/',
  resolve: {
    alias: {
      // @solana/web3.js v1 imports the Node `buffer` builtin even in its browser
      // build. Vite's dev server would otherwise externalize that bare specifier
      // to an empty module, leaving `Buffer` undefined at runtime (breaking tx
      // serialize/sign). Alias it to the real `buffer` npm package (already
      // installed as a web3 dependency) so Buffer is bundled in dev and prod.
      buffer: fileURLToPath(new URL('./node_modules/buffer/index.js', import.meta.url)),
    },
  },
});
