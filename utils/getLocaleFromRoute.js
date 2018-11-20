import isLocale from './isLocale'
/**
 * Get locale from a route
 * @param  {string} route Route
 * @return {string}       Locale string.
 */
const getLocaleFromRoute = function (route) {
  route = route.substr(1, route.length) // remove the first slash
  let routeSegments = route.split('/')
  let firstSegment = routeSegments[0]

  let locale
  if (isLocale(firstSegment)) {
    locale = firstSegment
    // routeSegments.shift()
  } else {
    locale = process.env.DEFAULT_LOCALE || false
  }

  return locale
}

export default getLocaleFromRoute
