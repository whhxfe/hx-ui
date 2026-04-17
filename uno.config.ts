import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      collections: {
        ep: () => import('@iconify/json/json/ep.json').then((m) => m.default),
        mdi: () => import('@iconify/json/json/mdi.json').then((m) => m.default),
        logos: () => import('@iconify/json/json/logos.json').then((m) => m.default),
        'streamline-logos': () =>
          import('@iconify/json/json/streamline-logos.json').then((m) => m.default),
      },
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
        cursor: 'pointer',
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
