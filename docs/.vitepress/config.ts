import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Lingua',
  description: 'The complete multilingual management system for Laravel',
  base: '/lingua-docs/',
  ignoreDeadLinks: true,

  vite: {
    build: {
      rollupOptions: {
        external: [/\/screenshots\//],
      },
    },
  },

  head: [
    ['link', { rel: 'icon', href: '/lingua-docs/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'Lingua' }],
  ],

  themeConfig: {
    logo: '/public/favicon.svg',
    siteTitle: 'LINGUA',

    nav: [
      { text: 'Guide', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: 'Features', link: '/features/languages', activeMatch: '/features/' },
      { text: 'API Reference', link: '/api/facade', activeMatch: '/api/' },
      {
        text: '1.x',
        items: [
          { text: 'Changelog', link: 'https://github.com/rivalex/lingua/blob/main/CHANGELOG.md' },
          { text: 'Contributing', link: 'https://github.com/rivalex/lingua/blob/main/.github/CONTRIBUTING.md' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'What is Lingua?', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
        {
          text: 'Architecture',
          items: [
            { text: 'How It Works', link: '/guide/architecture' },
            { text: 'Translation Storage', link: '/guide/storage' },
            { text: 'Publishing Assets', link: '/guide/publishing' },
          ],
        },
      ],
      '/features/': [
        {
          text: 'UI Features',
          items: [
            { text: 'Language Management', link: '/features/languages' },
            { text: 'Translation Management', link: '/features/translations' },
            { text: 'Language Selector', link: '/features/language-selector' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'RTL / LTR Support', link: '/features/rtl-support' },
            { text: 'Vendor Translations', link: '/features/vendor-translations' },
            { text: 'Bi-directional Sync', link: '/features/sync' },
            { text: 'Rich Text Editor', link: '/features/rich-text' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Lingua Facade', link: '/api/facade' },
            { text: 'Artisan Commands', link: '/api/artisan-commands' },
            { text: 'Blade Components', link: '/api/blade-components' },
            { text: 'Events', link: '/api/events' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/rivalex/lingua' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Alessandro Rivolta',
    },

    editLink: {
      pattern: 'https://github.com/rivalex/lingua-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    search: {
      provider: 'local',
    },

    outline: {
      level: [2, 3],
    },
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
})
