/**
 *  Pads a number with zeros
 *
 *  1 => '01'
 */

function padNumber(num) {
  return num.toString().padStart(2, '0')
}

export default padNumber
