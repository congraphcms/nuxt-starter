import axios from 'axios'
import cachios from 'cachios'
import urlConfig from '@/config/urls'
import {
  indexOf,
  find,
  forEach,
  has,
  isString,
  isObject
} from 'lodash'

// configure `node-cache` to keep cache forever!
const cachiosInstance = cachios.create(axios, {
  stdTTL: 1,
  checkperiod: 1,
});
// import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions'

const actions = {
  SET_STATE ({ commit }, obj) {
    let value = Object.values(obj)[0]
    let prop = Object.keys(obj)
    commit('SET_STATE', { prop: prop, value: value })
  },

  LOAD_PAGES ({ commit, dispatch }, locale) {
    // define includes
    // @TODO make this configurable outside of this file
    let includes = [
      'fields.icon',
      'fields.cover_image'
    ].join(',')

    // let apiUrl = process.env.apiUrl + 'api/delivery/entities?locale=' + locale + '&include=' + includes
    let apiUrl = `${process.env.CG_URL}api/delivery/entities?locale=${locale}&include=${includes}`

    // return cachios.get(apiUrl, {
    //   useCache: false,
    //   ttl: 1 // seconds
    // })
    return cachiosInstance.get(apiUrl)
    .then(response => {
      commit('SET_STATE', { prop: 'pages', value: response.data.data })
      dispatch('DECORATE_PAGES')
    })
  },

  /**
   * Parse cms entites
   *
   * Parse urls; sets 'url', 'slug', and 'parent' for relevant entities.
   *
   */
  PARSE_PAGES ({ commit, getters }) {
    let parseUrl = (page) => {
      if (!page || page.url) return

      let url
      let entity_type = page.entity_type
      let attr_set = page.attribute_set_code

      // check for parent
      // -----------------------------------------------------------------------
      let parent
      let parentPage
      let parentUrl
      let slug

      // look for parent field in the page
      if ('parent' in page.fields) {
        parent = page.fields.parent
      }

      // set the parent for a blog post
      // if (attr_set === 'post') {
      //   let parentPage = getters.getByProp('attribute_set_code', 'page_blog', 'pages')
      //   if (!parentPage || !parentPage.name) {
      //     parseUrl(parentPage)
      //   }
      //   if (parentPage) {
      //     parentUrl = parentPage.url
      //   }
      //   page.parent = parentPage
      // }

      // set the parent for other entities
      if (parent) {
        let parentPage = getters.getByProp('id', parent.id, 'pages')

        // if (!parentPage || !('slug' in parentPage)) {
        //   parseUrl(parentPage);
        // }

        if (parentPage && ('slug' in parentPage)) {

        }

        if (parentPage) {
          parentUrl = parentPage.url
        }
      }

      // parse relations
      // -----------------------------------------------------------------------
      // let relations = [
      //   'images'
      // ]

      // page.fields = _.mapValues(page.fields, (field, key) => {
      //   let isRel = _.includes(relations, key)
      //   if (isRel) {
      //     if (_.isArray(field)) {
      //       return _.mapValues(field, (f) => {
      //         return getters.getByProp('id', f.id, 'pages')
      //       })
      //     } else {
      //       return getters.getByProp('id', field.id,  'pages')
      //     }
      //   } else {
      //     return field
      //   }
      // })

      // set page slug
      // -----------------------------------------------------------------------
      // 1. look for slug field first
      if ('slug' in page.fields) {
        slug = page.fields.slug
      }

      page.name = page.fields.title ? page.fields.title.sanitize() : null

      // Set URL for specific entities
      let entities_with_url = [
        'page'
      ]

      if (_.includes(entities_with_url, entity_type)) {
        url = parentUrl + '/' + page.name
        page.url = url
      }
    }

    // get raw pages
    let pages = getters.getPages

    // parse
    _.each(pages, parseUrl)

    // order
    // let orderedPages = _.orderBy(pages, function (item) {
    //   return 'order' in item.fields ? parseInt(item.fields.order) : 0
    // })

    commit('SET_STATE', { prop: 'parsedPages', value: pages })
  },

  /**
   * Set URLs/slugs/parents for pages
   */
  DECORATE_PAGES ({commit, getters}) {
    let urls = [];
    // get raw pages
    let pages = getters.getPages
    
    let decoratePage = (page) => {

      // ALREADY DECORATED
      if(page.decorated) {
        return page
      }

      // parse relations
      // -----------------------------------------------------------------------

      let getRelation = (field, key) => {
        if (_.isArray(field)) {
          return _.map(field, getRelation)
        }

        if (_.isObject(field) && field !== null) {
          if ('id' in field && 'type' in field && field.type == 'entity') {
            return decoratePage(pages.find(p => p.id === field.id))
          }
        }

        return field
      }

      page.fields = _.mapValues(page.fields, getRelation)


      // SHUOLD HAVE URL
      // check if entity should have url
      let pageType = page.entity_type
      let pageSet = page.attribute_set_code
      let typeConfig
      // if config has defined entity_types/attribute_sets
      if(urlConfig.get('include').size > 0) {
        let includeConfig = urlConfig.get('include')
        
        if (!includeConfig.has(pageType)) {
          // if page not in defined set -> skip
          return
        }

        typeConfig = includeConfig.get(pageType)

        if(typeConfig.get('attribute_sets').length > 0) {
          if (indexOf(typeConfig.get('attribute_sets'), pageSet) === -1) {
            // if page not in defined set -> skip
            return;
          }
        }
      }

      // SLUG
      let pageSlug
      // check if slug is taken or it needs to be generated
      if(urlConfig.get('slug_keys').length > 0) {
        forEach(urlConfig.get('slug_keys'), function(key) {
          if (!pageSlug && has(page.fields, key) && isString(page.fields[key]) && page.fields[key].length > 0) {
            pageSlug = page.fields[key]
          }
        })
      }
      
      // (optional) Generate slug
      // if config hasn't got defined slug attributes -> generate
      if(!pageSlug && urlConfig.get('title_keys').length > 0) {
        forEach(urlConfig.get('title_keys'), function (key) {
          if (!pageSlug && has(page.fields, key) && isString(page.fields[key]) && page.fields[key].length > 0) {
            pageSlug = page.fields[key].sanitize()
          }
        })
      }
      
      // if there are no defined title_keys or page doesn't have title_key use primary_field
      if (!pageSlug && page.primary_field && isString(page.fields[page.primary_field]) && page.fields[page.primary_field].length > 0) {
        pageSlug = page.fields[page.primary_field].sanitize()
      }

      // if page's primary_attribute isn't a string skip
      if(!pageSlug) {
        return;
      }

      // PARENT
      let parent
      let parentUrl = ''
      // if config doesn't have defined parent field -> skip
      if(urlConfig.get('parent_keys').length > 0) {
        // if page doesn't have one of parent fields -> skip
        forEach(urlConfig.get('parent_keys'), function (key) {
          if (!parent && has(page.fields, key) && isObject(page.fields[key]) && page.fields[key].id > 0) {
            // find parent by ID
            parent = getters.getByProp('id', page.fields[key].id, 'pages')
            // if parent empty -> skip
            if(!parent) {
              return;
            }

            // decorate parent
            parent = decoratePage(parent)
            // take parent URL
            if(parent.url) {
              parentUrl = parent.url
            }
          }
        })
      }

      if(!parent && typeConfig.get('default_parent')) {
        parent = getters.getByProp('id', typeConfig.get('default_parent'), 'pages')

        if (parent) {
          // decorate parent
          parent = decoratePage(parent)
          // take parent URL
          if (parent.url) {
            parentUrl = parent.url
          }
        }
      }

      if (!parent && typeConfig.get('default_parent_by_set')) {
        parent = getters.getByProp('attribute_set_code', typeConfig.get('default_parent_by_set'), 'pages')

        if (parent) {
          // decorate parent
          parent = decoratePage(parent)
          // take parent URL
          if (parent.url) {
            parentUrl = parent.url
          }
        }
      }

      // URL
      let pageUrl
      let urlPrefix = (typeConfig.get('default_url_prefix')) ? '/' + typeConfig.get('default_url_prefix') : ''
      // take parent URL and page slug and combine them to unique URL for the page
      pageUrl = urlPrefix + parentUrl + '/' + pageSlug
      urls.push(pageUrl)
      // make absolute & relative URLS
      
      // attach slug, url, and parent to page
      page.slug = pageSlug
      page.url = pageUrl
      page.parent = parent
      page.decorated = true


      // return
      return page
    }

    

    // parse
    _.each(pages, decoratePage)

    // order
    // let orderedPages = _.orderBy(pages, function (item) {
    //   return 'order' in item.fields ? parseInt(item.fields.order) : 0
    // })
    console.log('DEFINED URLS: ', urls)
    commit('SET_STATE', { prop: 'parsedPages', value: pages })

  }
}

export default actions
