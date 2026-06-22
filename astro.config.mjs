// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig, envField } from "astro/config"
import react from "@astrojs/react"

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), mdx()],
  redirects: {
    '/wishlist': 'https://wishvaults.com/list/martin',
  },
  env: {
    schema: {
      PUBLIC_CONTACT_FORM_ACCESS_KEY: envField.string({ context: "client", access: "public", optional: false }),
      // PUBLIC_CF_SITE_KEY: envField.string({ context: "client", access: "public", optional: false }),
    }
  }
})
