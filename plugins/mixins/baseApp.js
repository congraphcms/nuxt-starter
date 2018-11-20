// import EventBus from '@/config/event-bus'
import urlConfig from '@/config/urls'
import templateConfig from '@/config/templates'
import metaConfig from '@/config/meta'

const baseApp = {
  watch: {
    page (val) {
      if (!val) return
      this.$store.dispatch('app/SET_STATE', { activePage: val })
    }
  },
  created () {
    const self = this
    let route = self.$store.state.route.path
    let locale = this.getLocale(route)

    self.$store.dispatch('app/SET_STATE', {
      locale: locale
    })

    // set locale
    self.setLocale(locale, false)
    self.$nextTick(() => {
      this.$store.dispatch('app/SET_STATE', {
        activePage: this.page
      })
    })
  },
  mounted () {
    const self = this
    self.$store.dispatch('app/SET_STATE', {
        width: window.innerWidth,
        height: window.innerHeight
    })

    self.resizeHandler()
    this.$validator.localize(this.locale)
    window.addEventListener('resize', self.resizeHandler)
  },
  head() {
    if (!this.page) return
    
    let headData = {
      meta: [],
      link: []
    }
    let metaLocalizedConfig = metaConfig.get(this.locale)

    // Meta Title
    let metaTitle = ''
    let metaTitlePrefix = ''
    let defaultMetaTitle = ''
    let siteName = 'WRPM Template'

    // get site name
    if (
      metaLocalizedConfig.has('site_name') &&
      metaLocalizedConfig.get('site_name').length > 0
    ) {
      siteName = metaLocalizedConfig.get('site_name')
    }

    // get prefix
    if (
      metaLocalizedConfig.has('meta_title_prefix') &&
      metaLocalizedConfig.get('meta_title_prefix').length > 0
    ) {
      metaTitlePrefix = metaLocalizedConfig.get('meta_title_prefix')
    }
    // get default meta title
    if (
      metaLocalizedConfig.has('default_meta_title') &&
      metaLocalizedConfig.get('default_meta_title').length > 0
    ) {
      defaultMetaTitle = metaLocalizedConfig.get('default_meta_title')
      if ( metaTitlePrefix.length > 0) {
        defaultMetaTitle = metaTitlePrefix + ' - ' + defaultMetaTitle
      }
    } else {
      if (metaTitlePrefix.length > 0) {
        defaultMetaTitle = metaTitlePrefix
      }
    }
    // get meta title from field
    if (
      metaConfig.has('meta_title_key') && 
      metaConfig.get('meta_title_key').length > 0 &&
      metaConfig.get('meta_title_key') in this.page.fields &&
      _.isString(this.page.fields[metaConfig.get('meta_title_key')])
    ) {
      metaTitle = this.page.fields[metaConfig.get('meta_title_key')]
    }
    if(metaTitle.length > 0) {
      if(metaTitlePrefix.length > 0) {
        metaTitle = metaTitlePrefix + ' - ' + metaTitle
      }
    } else {
      if (defaultMetaTitle.length > 0) {
        metaTitle = defaultMetaTitle
      } else {
        metaTitle = defaultMetaTitle
      }
      metaTitle = siteName
    }
    
    headData.title = metaTitle

    // Meta Description
    let metaDescription = ''
    let defaultMetaDescription = ''

    // get default meta description
    if (
      metaLocalizedConfig.has('default_meta_description') &&
      metaLocalizedConfig.get('default_meta_description').length > 0
    ) {
      defaultMetaDescription = metaLocalizedConfig.get('default_meta_description')
    }

    // get meta description from field
    if (
      metaConfig.has('meta_description_key') &&
      metaConfig.get('meta_description_key').length > 0 &&
      metaConfig.get('meta_description_key') in this.page.fields &&
      _.isString(this.page.fields[metaConfig.get('meta_description_key')])
    ) {
      metaDescription = this.page.fields[metaConfig.get('meta_description_key')]
    }
    if (metaDescription.length == 0) {
      if (defaultMetaDescription.length > 0) {
        metaDescription = defaultMetaDescription
      }
    }
    
    headData.meta.push({
      name: 'description',
      hid: 'description',
      content: metaDescription
    })

    return headData;

    // return {
    //   title: this.page.fields.meta_title,
    //   meta: [{
    //       name: 'description',
    //       hid: 'description',
    //       content: this.page.fields.meta_description
    //     },
    //     {
    //       name: 'og:image',
    //       content: this.getImageVersion(this.page, 'featured_image', 'medium')
    //     },
    //     {
    //       name: 'twitter:card',
    //       content: 'summary'
    //     },
    //     {
    //       name: 'twitter:url',
    //       content: 'http://maximus.asw.eu/'
    //     },
    //     {
    //       name: 'twitter:title',
    //       content: this.page.fields.meta_title
    //     },
    //     {
    //       name: 'twitter:description',
    //       content: this.page.fields.meta_description
    //     },
    //     {
    //       name: 'twitter:image',
    //       content: this.getImageVersion(this.page, 'featured_image', 'medium')
    //     }
    //   ]
    // }
  },
  computed: {
    locale () {
      return this.$store.getters['app/getState']('locale')
    },
    pages () {
      return this.$store.getters['pages/getPages']
    },
    parsedPages () {
      return this.$store.getters['pages/getParsedPages']
    },
    page () {
      return this.parseUrlPath()
    },
    pageTemplate () {
      if (!this.page) return

      let template

      for (const [rule, settings] of templateConfig) {
        switch (rule) {
          case "template_keys":
            for (const templateField of settings) {
              if (templateField in this.page.fields && _.isString(this.page.fields[templateField]) && this.page.fields[templateField].length > 0) {
                template = this.page.fields[templateField]
                break
              }
            }
            break
          case "template_set_map":
            if (settings.has(this.page.attribute_set_code)) {
              template = settings.get(this.page.attribute_set_code)
              break
            }
            break
          case "template_type_map":
            if (settings.has(this.page.entity_type)) {
              template = settings.get(this.page.entity_type)
              break
            }
            break
        }
      }
      
      // handle 404
      if(!template) {
        if (templateConfig.has('default_template') && templateConfig.get('default_template').length > 0) {
          console.log(templateConfig.get('default_template') + " Template")
          return templateConfig.get('default_template')
        }
        console.log(templateConfig.get('not_found_template') + " Template")
        return templateConfig.get('not_found_template')
      }

      template = this.capitalize(template)
      let templateExists = _.has(this.$options.components, template)

      // let mobileTemplate = template + "Mobile"
      // let mobileTemplateExists = _.has(this.$options.components, mobileTemplate)
      // return mobile template for mobile if such template exists
      // if (mobileTemplateExists && this.$device.isMobile){
      //   return mobileTemplate
      // }

      // handle 404
      if (!templateExists) {
        console.log(templateConfig.get('not_found_template') + " Template")
        return templateConfig.get('not_found_template')
      }

      console.log(template + " Template")
      return template
    }
  },
  methods: {
    parseUrlPath () {
      let route = this.$store.state.route.path
      // check if there is only locale present in the url
      let routeSegments = route.split('/')
      if (routeSegments[0] === '' ) {
        routeSegments.shift()
      }

      let onlyLocale = false

      // do we need to check for locale in url
      if (urlConfig.localized_url) {
        // check if we have only a locale in the path (e.g. "/en_US" )
        let firstSegment = routeSegments[0]
        onlyLocale = routeSegments.length === 1 && this.isLocale(firstSegment)
      }

      //  ['', '/', '/en_US'] should all go to home page
      if (!route.length || route.length < 2 || onlyLocale) {
        return this.$store.getters['pages/getByUrl']('/' + urlConfig.get('home_url'))
      }
      let page = this.$store.getters['pages/getByUrl'](route)

      return page
    },
    resizeHandler () {
      const self = this

      self.$store.dispatch('app/SET_STATE', {
        width: window.innerWidth,
        height: window.innerHeight
      })

      self.$nextTick(() => {
        self.$bus.$emit('resize')
      })
    },
    setLocale (locale, fetch) {
      fetch && this.$store.dispatch('pages/LOAD_PAGES', locale)
      this.$validator.localize(locale)
      this.$i18n.locale = locale
    }
  }
}

export default baseApp
