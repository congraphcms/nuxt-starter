import customSelect from 'custom-select'
import Vue from 'vue'

Vue.mixin({
  methods: {
    initSelect (el) {
      if (this.cs) {
        this.cs.destroy();
      }
      this.cs = customSelect(el)[0]
    }
  }
})
