import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  extend: {
    fontFamily: {
       nunito: ["var(--font-nunito)"],
    },
  },
  plugins: [],
}

export default config
