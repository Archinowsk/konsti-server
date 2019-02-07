/* @flow */
const arrayToObject = (array: Array<any>) =>
  array.reduce((obj, item) => {
    obj = item
    return obj
  }, {})

export default arrayToObject
