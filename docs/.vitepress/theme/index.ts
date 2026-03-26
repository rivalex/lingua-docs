import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Screenshot from './Screenshot.vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Screenshot', Screenshot)
  },
} satisfies Theme
