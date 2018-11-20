import axios from './axios'

let data // simple data cache
let includes = [
  "fields.image",
  "fields.gallery",
  "fields.featured_image",
].join(",")

const cachedApi = {
  getData (locale) {
    let url = process.env.apiUrl + 'api/delivery/entities?locale=' + locale + '&include=' + includes

    return new Promise((resolve, reject) => {
      if (data) { // get data from cache if exists
        resolve(data)
      } else { // else get data from API
        axios.request({
          url: url
        }).then(response => {
          data = response.data // set data, so new getData() will take data from cache
          resolve(data)
        }).catch(reject)
      }
    })
  }
}
