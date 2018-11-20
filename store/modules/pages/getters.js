// @TODO import underscore / lodash

const getters = {
  // pages
  getPages: state => state.pages,
  getParsedPages: state => state.parsedPages,
  search: state => keyword => state.parsedPages.find(page => page.name === keyword),
  getByUrl: state => url => state.parsedPages.find(page => page.url === url),
  getByType: state => type => state.parsedPages.filter(page => page.entity_type === type),
  // getManyByParent: state => {
  //   return (value) => state.parsedPages.filter(page => {
  //     var attr = page.fields.parent_page || page.fields.category;
  //     var parent = value.fields.parent_page || value.fields.category;
  //     if (!attr || !value) {
  //       return
  //     }
  //     return attr.id === parent.id
  //   })
  // },
  getSiblings: (state, getters) => model =>
    getters.getManyByParent(model).filter(child => child.id === model.id),
  getChildren: state => {
    return (model) => state.parsedPages.filter(page => {
      let attr = page.fields.parent_page
      if (!attr) return
      return attr.id === model.id
    })
  },
  getManyByProp: state => (type, value) => state.parsedPages.filter(page => page[type] === value),
  getByProp: state => {
    return (type, value, collection = "parsedPages") => state[collection].find(page => page[type] == value)
  },
  // getManyByAttr: state => {
  //   return (type, value) => state.parsedPages.filter(page => {
  //     var attr = page.fields[type]
  //     if (!attr) return
  //     return attr.value === value
  //   });
  // },
  // getByAttr: state => {
  //   return (type, value, collection = "parsedPages") => state[collection].find(page => {
  //     var attr = page.fields[type]
  //     if (!attr) return
  //     return attr === value
  //   })
  // },
}

export default getters
