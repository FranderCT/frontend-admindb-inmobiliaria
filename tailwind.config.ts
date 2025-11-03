import {heroui} from '@heroui/theme';
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/skeleton.js"
  ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Geist Sans', 'ui-sans-serif', 'system-ui', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
            },
        },
    },
  plugins: [heroui()],
}

export default config