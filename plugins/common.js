// Common functions
import Vue from 'vue'
let removeDiacritics = require('diacritics').remove

const common = {
  install (options) {

    String.prototype.sanitize = function () {
      let g = removeDiacritics(this)
      return g.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    }

    Vue.prototype.convertToSlug = (text) => {
      return text ? text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : null
    }

    // capitalize first letter
    Vue.prototype.capitalize = (string) => {
      if (typeof string !== "string") {
        return string
      }
      return string.charAt(0).toUpperCase() + string.slice(1)
    }

    Vue.prototype.getHostName = (url) => {
      var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
      if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2]
      }
      return null
    }

    // USE LIKE THIS --> this.loadImage(imgUrl).then(() => {});
    Vue.prototype.loadImage = (url) => {
      return new Promise((resolve, reject) => {
        var img = new Image()
        img.onload = () => {
          resolve(url)
        }
        img.onerror = () => {
          reject(url)
        }
        img.src = url
      })
    }

    // USE LIKE THIS --> this.loadImage([imgUrls]).then(() => {});
    Vue.prototype.loadImages = (urls) => {
      let promises = []
      _.each(urls, (url) => {
        let promise = new Promise((resolve, reject) => {
          var img = new Image()
          img.onload = () => {
            resolve(url)
          }
          img.onerror = () => {
            reject(url)
          }
          img.src = url
        })
        promises.push(promise)
      })

      return promises
    }

  }
}

Vue.use(common);
