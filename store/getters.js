const getters = {
  // pages
  getPages: state => state.pages,
  getPageBySlug: state => slug => state.pages.find(page => page.slug === slug),
  getPageByUrl: state => url => state.pages.find(page => page.url === url)
}

export default getters
