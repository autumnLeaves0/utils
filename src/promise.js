import { getValue } from './type.js';

function createCache () {
  let cache = null;
  return {
    get () { return cache; },
    set (val) {
      cache = val;
      return cache;
    }
  };
}

/**
 * @description 传入 promise 的创建函数, 返回一个包装函数, 用于缓存 promise 的值, 默认存储在 returnFn.cache
 * @param {function} fn function: promise
 * @param {function} cache.get 存储媒介
 * @param {function} cache.set 存储媒介
 * @returns {function} function: promise
 */
export function promiseCache (fn, cache = createCache()) {
  promiseCacheWrap.cache = cache;

  function promiseCacheWrap () {
    const arg = arguments;
    const cacheVal = cache.get(...arg);
    if (cacheVal) return Promise.resolve(cacheVal);
    else {
      return Promise.resolve(
        cache.set(
          fn(...arg).catch(error => {
            cache.set(null);
            return Promise.reject(error);
          }),
          ...arg
        )
      );
    }
  };

  return promiseCacheWrap;
}

/**
 * @description 传入 promise 的创建函数, 返回一个包装函数, 额外返回一个取消 promise 的函数
 * @param {function} fn function: promise
 * @return {function } function: [promise, cancel: function]
 */
export function promiseCancel (fn) {
  return function promiseCancelWrap () {
    let cancelReject;
    const cancelPromise = new Promise((resolve, reject) => {
      cancelReject = reject;
    });

    function cancel (error) {
      return cancelReject(error);
    }

    return [
      Promise.race([cancelPromise, fn(...arguments)]),
      cancel
    ];
  };
}

/**
 * @description 传入 promise 的创建函数, 返回一个包装函数, 会自动取消上一个函数中创建的 promise
 * @param {function} fn function: promise
 * @return {function} function: promise
 */
export function promiseAutoCancel (fn, error) {
  const wrapFn = promiseCancel(fn);
  let prevCancel = null;

  return function wrapCancel () {
    if (prevCancel) prevCancel(getValue(error));
    const [promise, cancel] = wrapFn(...arguments);
    prevCancel = cancel;
    return promise;
  };
}
