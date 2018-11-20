
const messages = {
  _default: (field) => `The ${field} value is not valid.`
}

const attributes = {
  fname: 'first name',
  lname: 'last name',
  msg: 'message'
}

export default {
  name: 'en_US',
  messages,
  attributes
}
