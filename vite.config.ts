import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Required for GitHub Pages: site is served at https://<user>.github.io/<repo-name>/
  base: '/product-finder-prototype/',
  plugins: [react()],
});
