// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  prefetch: false,
  vite: {
    ssr: {
      noExternal: true
    },
    build: {
      sourcemap: true
    }
  }
});
