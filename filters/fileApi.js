/**
 *  Takes relative url and makes it
 *  absolute url to bakcend delivery File API
 *
 *  files/image.jpeg => https://api.backend.com/api/delivery/files/image.jpeg
 */

function fileApi(relativeUrl, version) {
  let absoluteUrl = `${process.env.apiUrl}api/delivery/${relativeUrl}`
  if(version && version.length > 0) {
    absoluteUrl += '?v=' + version
  }
  return absoluteUrl
}

export default fileApi
