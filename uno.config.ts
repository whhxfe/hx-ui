import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'
// import ep from '@iconify/json/json/ep.json'
// import mdi from '@iconify/json/json/mdi.json'
// import logos from '@iconify/json/json/logos.json'


import ep from '@iconify/json/json/ep.json'
import mdi from '@iconify/json/json/mdi.json'
import logos from '@iconify/json/json/logos.json'
import streamlineLogos from '@iconify/json/json/streamline-logos.json'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      collections: {
        ep,
        mdi,
        logos,
      },
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
        'cursor': 'pointer',
      },
    }),
  ],
  content: {
    pipeline: {
      include: [
        'packages/**/*.{vue,ts,tsx}',
        'play/src/**/*.{vue,ts,tsx}',
        'docs/**/*.{md,vue,ts,tsx}',
      ],
    },
  },
})
