
/**
 * Check if the given string is locale
 * @param  {string} str String to check.
 * @return {boolean}
 */
const isLocale = function (str) {
  let localeRegExp = new RegExp(/^[a-z]{2}_[A-Z]{2}$/)
  return !!localeRegExp.test(str)
}

export default isLocale
