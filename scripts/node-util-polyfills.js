const util = require('util')

function definePolyfill(name, implementation) {
  if (typeof util[name] !== 'function') {
    util[name] = implementation
  }
}

definePolyfill('isRegExp', (value) => Object.prototype.toString.call(value) === '[object RegExp]')
definePolyfill('isDate', (value) => Object.prototype.toString.call(value) === '[object Date]')
definePolyfill('isError', (value) => value instanceof Error)
definePolyfill('isFunction', (value) => typeof value === 'function')
definePolyfill('isObject', (value) => value !== null && typeof value === 'object')
definePolyfill(
  'isPrimitive',
  (value) => value === null || (typeof value !== 'object' && typeof value !== 'function')
)
