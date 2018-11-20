const webpack = require('webpack')

module.exports = {
  router: {
    middleware: 'i18n'
  },

  /*
   ** Global CSS
   */
  css: ['@/assets/scss/bootstrap.scss', 'swiper/dist/css/swiper.css'],

  // CACHING
  cache: {
    max: 1,
    maxAge: 1
  },

  // MODULES
  modules: [
    'nuxt-device-detect',
    // 'bootstrap-vue/nuxt',
    ['nuxt-sass-resources-loader', ['@/assets/scss/design.scss']],
    ['@nuxtjs/dotenv', { /* module options */ }]
    // ['@nuxtjs/google-tag-manager', { id: 'GTM-5FK7GT2' }],
    // '@nuxtjs/axios',
    // '@nuxtjs/pwa',
  ],

  /**
   * Customize the progress bar color
   */
  loading: {
    color: '#000',
    failedColor: '#f00',
    height: '2px'
  },

  /*
   ** Build configuration
   */
  router: {
    extendRoutes(routes, resolve) {
      // @TODO here we may fetch the pages and create the custom routes
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/_page.vue')
      })
    }
  },

  build: {
    vendor: [
      'vee-validate',
      'vue-i18n',
      'babel-polyfill'
    ],
    babel: {
      presets: [
        [ 'vue-app', {
          useBuiltIns: true,
          targets: {
            ie: 9,
            uglify: true
          }
        }]
      ]
    },
    extractCSS: {
      allChunks: true
    },

    /**
     * Run ESLint on save
     */
    extend (config, { isDev, isClient }) {

      const urlLoader = config.module.rules.find((rule) => rule.loader === 'url-loader')
      urlLoader.test = /\.(png|jpe?g|gif)$/

      config.module.rules.push({
        test: /\.svg$/,
        loader: 'vue-svg-loader',
        exclude: /node_modules/
      })

      // const extract = config.plugins.find(plugin => plugin.renderExtractedChunk)
      // extract.options.allChunks = true

      if (!isClient) {
        // This instructs Webpack to include `vue2-google-maps`'s Vue files
        // for server-side rendering
        config.externals.splice(0, 0, function(context, request, callback) {
          if (/^vue2-google-maps($|\/)/.test(request)) {
            callback(null, false)
          } else {
            callback()
          }
        })
      }

      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          // exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/
          exclude: /(node_modules)/
        })
      }
    },

    plugins: [
      new webpack.ProvidePlugin({
        '_': 'lodash',
        'moment': 'moment'
      })
    ],
  },

  plugins: [
    '~plugins/vee-validate.js',
    '~/plugins/common',
    '~/plugins/vuex-router-sync',
    '~/plugins/framework',
    '~/plugins/i18n.js',
    // '~/plugins/siteConfig.js',
    '~/plugins/eventBus.js',
    '~/plugins/gmaps.js',
    // '~/plugins/axios',
    // '~/plugins/cachedApi',
    // '~/plugins/autoload-pages.js',
    '~/plugins/global-components.js',
    '~plugins/filters.js',
    {
      src: '~/plugins/nonssr.js',
      ssr: false
    },
    {
      src: '~/plugins/routerHistory.js',
      ssr: false
    },
    {
      src: '~plugins/ga.js',
      ssr: false
    },
    {
      src: '~/plugins/select.js',
      ssr: false
    },
    {
      src: '~/plugins/nuxt-swiper-plugin.js',
      ssr: false
    }
  ]
}
