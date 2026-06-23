// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig, envField } from "astro/config"
import react from "@astrojs/react"

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      watch: {
        ignored: ["**/contact-worker/**"],
      }
    },
    plugins: [tailwindcss()],
  },
  integrations: [react(), mdx()],
  redirects: {
    '/wishlist': 'https://wishvaults.com/list/martin',
  },
  env: {
    schema: {
      PUBLIC_CF_SITE_KEY: envField.string({ context: "client", access: "public", optional: false }),
      PUBLIC_WORKER_URL: envField.string({ context: "client", access: "public", optional: false }),
    }
  }
})
