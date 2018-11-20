import Vue from 'vue'
import { routerHistory, writeHistory } from 'vue-router-back-button'

Vue.use(routerHistory)

export default ({ app: { store, router } }) => {
  router.afterEach(writeHistory)
}
