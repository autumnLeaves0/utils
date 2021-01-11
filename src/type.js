/**
 * @description 是否是有长度的数组
 * @param {any} val any
 * @returns {boolean} boolean
 */
export function isValidArray (val) {
  return Array.isArray(val) && val.length !== 0;
}

/**
 * @description 如果参数是参数，返回函数的返回值，否则返回参数
 * @param {any} valOrFn any
 * @returns {any}
 */
export function getValue (valOrFn) {
  return typeof valOrFn === 'function' ? valOrFn() : valOrFn;
}

/**
 * @description 是否是 promise
 * @param {any} val any
 * @returns {boolean} boolean
 */
export function isPromise (val) {
  return (
    val !== undefined &&
    val !== null &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  );
}
