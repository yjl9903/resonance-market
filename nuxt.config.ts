import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  debug: false,
  devtools: { enabled: true },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    'shadcn-nuxt',
    'unplugin-info/nuxt',
    'unplugin-analytics/nuxt'
  ],
  nitro: {
    prerender: {
      autoSubfolderIndex: false
    }
  },
  components: [
    {
      path: '~/components/common',
      pathPrefix: false
    },
    {
      path: '~/components/docs',
      pathPrefix: false
    },
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  alias: {},
  css: ['@unocss/reset/tailwind.css'],
  app: {
    head: {
      title: '雷索纳斯市场',
      viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
      htmlAttrs: {
        lang: 'zh-CN'
      },
      link: [{ rel: 'icon', href: '/favicon.png' }],
      meta: [],
      script: []
    }
  },
  image: {},
  unocss: {
    preflight: true
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  colorMode: {
    classSuffix: ''
  },
  info: {
    meta: {
      // ...
    }
  },
  analytics: {}
});
