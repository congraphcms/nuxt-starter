<template>
  <div id="app">
    <app-header />
    <app-sidebar />
    <transition name="page-transition">
      <component :is="pageTemplate" :model="page" />
    </transition>
    <app-footer />
  </div>
</template>

<script>
import BaseApp from '@/plugins/mixins/baseApp'

// All possible templates
import NotFound from '@/pages/NotFound'
import Page from '@/pages/Page'

import AppHeader from '@/components/AppHeader'
import AppSidebar from '@/components/AppSidebar'
import AppFooter from '@/components/AppFooter'

import CustomTransition from '@/components/transitions/CustomTransition'

const cmps = {
  AppHeader,
  AppSidebar,
  AppFooter
}

const ps = require.context(
  // Look for files in the components/globals directory
  '@/pages',
  // Do not look in subdirectories
  false,

  // Only include "_base-" prefixed .vue files
  // /_base-[\w-]+\.vue$/
  

  // include all files
  /[A-Z]\w+\.(vue)$/
)
try{
  // For each matching file name...
  ps.keys().forEach(fileName => {
    
    // console.log(fileName);
    // Get the component config
    const pageConfig = ps(fileName)
    const pageName = fileName
      .split('/')
      .pop()
      .split('.')[0]
    // const filePath = '@/pages/' + pageName
    // // import Page from filePath
    // console.log(/*fileName, pageConfig,*/ pageName, pageConfig)
    cmps[pageName] = pageConfig.default || pageConfig
  })
} catch(e) {
  console.error(e)
}


export default {
  name: 'app',
  mixins: [
    BaseApp
  ],
  components: cmps,
  data () {
    return {
      showCookie: false,
      siteName: "WRPM TEMPLATE"
    }
  },
  computed: {
    pageKey () {
      let key = this.page ? this.page.id : null

      // CUSTOM TRANSITION PAGES
      // stay on the same template and don't do the default transition
      if (this.page && this.page.attribute_set_code === 'news_article') {
        key = 'blog'
      }

      return key
    },
    gdprVisible () {
      return this.$store.getters['app/getState']('gdprVisible')
    },
    isShrinked () {
      return this.$store.getters["app/getState"]("scrollTop") > 30
    }
  },
  watch: {
    // locale (val) {
    //   this.loaded = false
    //   this.$store.dispatch('app/SET_STATE', { locale: val })
    //   this.setLocale(val)
    // }
  },
  
  // events: {},
  mounted () {
    const self = this
    self.$nextTick(self.resizeHandler)
    if (!this.parsedPages.length) {
      console.warn("API fetch didn't finish on server side")
      this.$store.dispatch('pages/LOAD_PAGES', 'en_US')
    }
    // this.showCookie = !cookies.get('showCookie')
  },
  
  methods: {
    // @TODO move this to app or create a plugin
    onMouseMove (e) {
      this.$store.dispatch('app/SET_STATE', {
        pageX: e.pageX,
        pageY: e.pageY
      })
    },
    cookieClick () {
      this.showCookie = false
      // cookies.set('showCookie', true)
    }
  }
}
</script>

<style lang="scss">
// app -------------------------------------------------------------------------

#app {
  overflow-x: hidden;
}
</style>
