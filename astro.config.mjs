// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
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
