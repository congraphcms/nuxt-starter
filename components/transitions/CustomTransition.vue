<template>
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:after-enter="afterEnter"
    v-on:leave="leave"
    v-bind:css="false">
     <slot></slot>
  </transition>
</template>

<script>
import {TweenMax, TimelineMax} from 'gsap'

export default {
  name: 'customTransition',
  data () {
    return {
      duration: .64
    }
  },
  props: [
    'delay',
    'img',
    'noAdditionalClasses',
    'pageTransition'
  ],
  computed: {
    mobile () {
      return this.$store.getters['app/getState']('mobile')
    },
    dl () {
      return this.delay || .1
    },
    dur () {
      return this.$store.getters['app/getState']("instantTransition")
        && this.pageTransition ? 0 : this.duration
    }
  },
  methods: {
    beforeEnter (el, done) {},
    afterEnter (el, done) {},
    enter (el, done) {
      const self = this

      self.tl = new TimelineMax({
        onComplete: () => {
          if (self.pageTransition){
            self.$store.dispatch('app/SET_STATE', {
              transitioning: false
            })
          }
          done()
        }
      })

      // delay
      let dl = this.pageTransition ? this.dl : 0

      // animate from
      let from = {
        opacity: 0
      }

      // animate to
      let to = {
        opacity: 1,
        delay: dl
      }

      this.tl.fromTo(el, this.dur, from, to)
    },
    leave (el, done) {
      if (this.pageTransition) {
        this.$store.dispatch('app/SET_STATE', {
          transitioning: true
        })
      }

      if (!this.noAdditionalClasses) {
        let classes = ['transitioning-out']
        if (this.pageTransition) {
          classes.push('h-100')
        }

        el.classList.add(...classes);
      }

      // delay
      let dl = this.pageTransition ? this.dl : 0

      TweenMax.to(el, this.dur, {
        opacity: 0,
        delay: dl,
        onComplete: () => {
          done()
        }
      })
    }
  }
}
</script>

<style scoped="">
</style>
