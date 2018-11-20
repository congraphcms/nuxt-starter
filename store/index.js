import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import pages from './modules/pages'
import isLocale from '@/utils/isLocale'
import getLocaleFromRoute from '@/utils/getLocaleFromRoute'
import state from './state'
import getters from './getters'

// Vue.use(Vuex)

export default () => {
  return new Vuex.Store({
    actions: {
      async nuxtServerInit ({ dispatch, commit, state }, { req, isDev }) {
        let route = state.route.path
        let locale = getLocaleFromRoute(route)
        console.log("Current route:", route)
        console.log("Current locale:", locale)
        console.log("FETCHING PAGES...")
        await dispatch('pages/LOAD_PAGES', locale)
      }
    },
    state,
    getters,
    modules: {
      app,
      pages
    }
  })
}
