import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  debug: false,
  devtools: { enabled: false },
  modules: [
    // 'nitro-cloudflare-dev',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    'shadcn-nuxt',
    'unplugin-info/nuxt',
    'unplugin-analytics/nuxt',
    '@nuxt/eslint' // https://eslint.nuxt.com/packages/module
  ],
  nitro: {
    prerender: {
      autoSubfolderIndex: false
    }
  },
  components: [
    // {
    //   path: '~/components/common',
    //   pathPrefix: false
    // },
    // {
    //   path: '~/components/docs',
    //   pathPrefix: false
    // },
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
  runtimeConfig: {
    TURSO_URL: import.meta.env.TURSO_URL,
    TURSO_AUTH_TOKEN: import.meta.env.TURSO_AUTH_TOKEN
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
  analytics: {
    umami: {
      src: `umami.onekuma.cn`,
      id: `6d532af3-e9bc-43a1-998b-8d3cae5fcbb6`
    },
    clarity: {
      id: 'lbvx2f1py2'
    }
  },
  eslint: {
    config: {
      stylistic: {
        indent: 2, // 2空格缩进
        semi: true, // 语句末尾需要分号
        commaDangle: 'never', // 不允许逗号结尾
        braceStyle: '1tbs' // 1tbs大括号风格, https://eslint.style/rules/js/brace-style
      }
    }
  }
});
