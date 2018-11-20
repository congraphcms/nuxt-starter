// common methods
import Vue from 'vue';

Vue.mixin({
  methods: {
    isLocale (segment) {
      const localeRegExp = new RegExp(/^[a-z]{2}_[A-Z]{2}$/)
      return localeRegExp.test(segment);
    },
    getLocale (route) {
      route = route.substr(1, route.length) // remove the first slash
      let routeSegments = route.split('/')
      let firstSegment = routeSegments[0]
      let locale

      if (this.isLocale(firstSegment)) {
        locale = firstSegment
        routeSegments.shift()
      } else {
        locale = process.env.DEFAULT_LOCALE
      }

      return locale;
    },
    removeDuplicates (myArr, prop) {
      return myArr.filter((obj, pos, arr) => arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos)
    },
    getUniqueValues (collection, filterName) {
      const self = this
      // A quick tip to remove all falsy (false, null, undefined, 0, NaN or an empty string) items out of an array
      collection = collection.filter(Boolean)
      if (!collection.length) {
        return
      }
      // @TODO remove underscore / lodash dependency
      let u = _.uniq(_.map(collection, (val, key) => val.fields[filterName]).filter((model) => {
        return model || _.isNumber(model)
      })).sort()

      return this.removeDuplicates(u, 'id')
    },
    getAttribute (model, key) {
      let attrs = (model && model.fields) || {}
      let value = false

      if (_.has(attrs, key)) {
        value = attrs[key]
        if (value == 0) {
          value = false
        }
      }

      return value
    },
    getImageVersion (model, key, version, index) {
      if (!model) return false

      let attrs = model.fields || {}
      let value = false

      let attr = model.type == "file" ? model : this.getAttribute(model, key)

      if (attr) {
        if (_.isArray(attr)) {
          let i = index || 0
          attr = attr[i]
        }

        if (!attr) {
          console.warn('no image found at current index')
          return
        }

        value = process.env.apiUrl + "api/delivery/" + attr.url
        value += version ? "?v=" + version + "_image" : ''

      } else {
        console.warn('no image found')
      }

      return value
    }
  }
})
