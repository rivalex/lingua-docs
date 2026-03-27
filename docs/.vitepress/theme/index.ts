import DefaultTheme from 'vitepress/theme-without-fonts'
import './custom.css'
import Screenshot from './Screenshot.vue'
import type { Theme } from 'vitepress'

import './fonts.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Screenshot', Screenshot)
  },
} satisfies Theme
