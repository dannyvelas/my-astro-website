import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import { remarkModifiedTime } from './remark-modified-time.mjs';
import netlify from "@astrojs/netlify";
import path from 'path';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  adapter: netlify(),
  markdown: {
    remarkPlugins: [remarkModifiedTime],
  },
  vite: {
    resolve: {
      alias: {
        '@images': path.resolve('./images'),
      },
    },
  },
});
