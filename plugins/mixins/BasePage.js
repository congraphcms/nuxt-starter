// import $ from 'jquery'
// import imagesLoaded from 'imagesloaded'
import Scrollbar from 'smooth-scrollbar'

const basePage = {
  // components: {},
  // mixins: [],
  props: [
    'model'
  ],
  // head () {
  //   let title = this.getAttribute(this.model, 'title')
  //   let image = this.getImageVersion(this.model, 'image')

  //   return {
  //     title: this.model.fields.meta_title || title,
  //     meta: [
  //       {
  //         hid: 'description',
  //         name: 'description',
  //         content: this.model.fields.meta_description || title
  //       },
  //       {
  //         hid: 'og:title',
  //         property: 'og:title',
  //         content: this.model.fields.meta_title || title
  //       },
  //       {
  //         hid: 'og:url',
  //         property: 'og:url',
  //         content: 'http://papirnabubenec.cz'
  //       },
  //       {
  //         hid: 'og:image',
  //         property: 'og:image',
  //         content: image || 'http://papirnabubenec.cz/ogDefault.jpg'
  //       },
  //       {
  //         hid: 'og:description',
  //         property: 'og:description',
  //         content: this.model.fields.meta_description || title
  //       }
  //     ]
  //   }
  // },
  computed: {
    pageComponents () {
      return this.getAttribute(this.model, 'page_components')
    },
    transitioning () {
      return this.$store.getters['app/getState']('transitioning')
    }
  },
  // created () {},
  mounted () {
    const self = this

    // this.initSmooth(this.$el)
    this.$nextTick(() => {
      this.resizeHandler()
    })

    if (!this.preventEvents) {
      this.$store.dispatch('app/SET_STATE', { scrollTop: 0 })
    }

    // imagesLoaded(this.$el, () => {
    //   self.resizeHandler()
    // })

    this.$bus.$on('resize', self.resizeHandler)
  },
  beforeDestroy () {
    if (this.scrollbar) {
      this.scrollbar.removeListener()
      this.scrollbar.destroy()
    }

    if (!this.preventEvents) {
      this.$store.dispatch('app/SET_STATE', { scrollTop: 0 })
    }
  },
  destroyed () {},
  methods: {
    chooseComponentTemplate (component) {
      let tmpl

      switch (component.attribute_set_code) {
        case 'gallery_text':
          tmpl = 'GalleryText'
          break

        default:
          tmpl = this.capitalize(component.attribute_set_code)
          break
      }

      return tmpl
    },
    resizeHandler () {
      if (!this.$refs.wrapper) return
      this.$store.dispatch('app/SET_STATE', {
        pageHeight: this.$refs.wrapper.clientHeight,
        pageWidth: this.$refs.wrapper.clientWidth
      })
    },
    onScroll (e) {
      this.$store.dispatch('app/SET_STATE', { scrollTop: e.target.scrollTop })
    },
    initSmooth (el, preventEvents) {
      const self = this

      // let ticking;
      // if (this.isMobile) {
      //   this.$el.removeEventListener('scroll', self.onScroll);
      //   this.$el.addEventListener('scroll', self.onScroll)
      //   return
      // }

      let scrollbar = Scrollbar.init(el, {
        damping: .11,
        renderByPixels: true
      })

      this.$bus.$on('updateScrollbar', (e) => {
        scrollbar.update()
      })

      if (preventEvents) return

      this.$store.dispatch('app/SET_STATE', { scrollTop: 0 })
      this.$bus.$on('scrollTo', (top) => {
        scrollbar.scrollTo(0, top, 600)
      })

      scrollbar.addListener((status) => {
        if (this.transitioning) return
        this.$store.dispatch('app/SET_STATE', { scrollTop: status.offset.y })
      })
    }
  }
}

export default basePage
