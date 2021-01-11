import {
  promiseCache,
  promiseCancel,
  promiseAutoCancel
} from './promise.js';

import { beforeEach, jest } from '@jest/globals';

let promiseCreator;
let fetch;
let resolveFaker;
const param = 'Test';

beforeEach(() => {
  const _fetch = jest.fn();
  const _resolveFaker = jest.fn();

  fetch = _fetch;
  resolveFaker = _resolveFaker;

  promiseCreator = (param) => new Promise(
    (resolve) => {
      _fetch(param);
      setTimeout(
        () => {
          _resolveFaker(param);
          resolve(param);
        },
        20
      );
    }
  );
});

describe('promiseCache 测试', () => {
  let promiseCacheWrap;

  beforeEach(() => {
    promiseCacheWrap = promiseCache(promiseCreator);
  });

  it('首次调用', async () => {
    expect(fetch).toHaveBeenCalledTimes(0);
    expect(resolveFaker).toHaveBeenCalledTimes(0);

    await expect(promiseCacheWrap(param)).resolves.toBe(param);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(resolveFaker).toHaveBeenCalledTimes(1);
  });

  it('获取数据失败', async () => {
    expect(fetch).toHaveBeenCalledTimes(0);
    expect(resolveFaker).toHaveBeenCalledTimes(0);

    let cancel;
    const promiseCancelWrap = promiseCancel(promiseCreator);
    promiseCacheWrap = promiseCache((...arg) => {
      const promiseCancelWrapReturns = promiseCancelWrap(...arg);
      cancel = promiseCancelWrapReturns[1];
      return promiseCancelWrapReturns[0];
    });

    setTimeout(() => {
      cancel('error');
    }, 10);

    await expect(promiseCacheWrap(param)).rejects.toBe('error');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(resolveFaker).toHaveBeenCalledTimes(0);
  });

  it('读取缓存', async () => {
    expect(fetch).toHaveBeenCalledTimes(0);
    expect(resolveFaker).toHaveBeenCalledTimes(0);

    const first = promiseCacheWrap(param);
    const second = promiseCacheWrap(param);

    await expect(first).resolves.toBe(param);
    await expect(second).resolves.toBe(param);

    expect(first).toBe(second);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(resolveFaker).toHaveBeenCalledTimes(1);

    const third = promiseCacheWrap(param);

    await expect(third).resolves.toBe(param);

    expect(third).toBe(second);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(resolveFaker).toHaveBeenCalledTimes(1);
  });

  it('删除缓存', async () => {
    expect(fetch).toHaveBeenCalledTimes(0);
    expect(resolveFaker).toHaveBeenCalledTimes(0);

    await expect(promiseCacheWrap(param)).resolves.toBe(param);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(resolveFaker).toHaveBeenCalledTimes(1);

    promiseCacheWrap.cache.set(null);

    await expect(promiseCacheWrap(param)).resolves.toBe(param);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(resolveFaker).toHaveBeenCalledTimes(2);
  });

  it('自定义cache', async () => {
    function createCache () {
      let cache = {};
      return {
        get (id) { return cache[id]; },
        set (val, id) {
          if (!val && !id) cache = {};
          else cache[id] = val;
          return val;
        }
      };
    }
    promiseCacheWrap = promiseCache(promiseCreator, createCache());

    await expect(promiseCacheWrap(1)).resolves.toBe(1);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(resolveFaker).toHaveBeenCalledTimes(1);

    await expect(promiseCacheWrap(2)).resolves.toBe(2);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(resolveFaker).toHaveBeenCalledTimes(2);

    await expect(promiseCacheWrap(1)).resolves.toBe(1);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(resolveFaker).toHaveBeenCalledTimes(2);

    promiseCacheWrap.cache.set(null, 1);

    await expect(promiseCacheWrap(1)).resolves.toBe(1);

    expect(fetch).toHaveBeenCalledTimes(3);
    expect(resolveFaker).toHaveBeenCalledTimes(3);
  });
});

describe('promiseCancel 测试', () => {
  let promiseCreatorWrap,
    promiseCreatorWrapReturns;

  beforeEach(() => {
    promiseCreatorWrap = promiseCancel(promiseCreator);
    promiseCreatorWrapReturns = promiseCreatorWrap(param);
  });

  it('return 数据结构', () => {
    expect(fetch).toHaveBeenCalledTimes(1);

    expect(promiseCreatorWrap).toBeInstanceOf(Function);

    expect(promiseCreatorWrapReturns).toBeInstanceOf(Array);
    expect(promiseCreatorWrapReturns[0]).toBeInstanceOf(Promise);
    expect(promiseCreatorWrapReturns[1]).toBeInstanceOf(Function);
  });

  it('取消', async () => {
    const error = 'Cancel';
    setTimeout(() => {
      promiseCreatorWrapReturns[1](error);
    }, 10);
    await expect(promiseCreatorWrapReturns[0]).rejects.toBe(error);
    expect(resolveFaker).not.toHaveBeenCalled();
  });

  it('不取消', async () => {
    await expect(promiseCreatorWrapReturns[0]).resolves.toBe(param);
  });
});

describe('promiseAutoCancel 测试', () => {
  const error = 'Cancel';
  let promiseAutoCancelWrap;

  beforeEach(() => {
    promiseAutoCancelWrap = promiseAutoCancel(promiseCreator, error);
  });
  it('调用一次', async () => {
    expect(resolveFaker).toHaveBeenCalledTimes(0);
    expect(fetch).toHaveBeenCalledTimes(0);

    await expect(promiseAutoCancelWrap(param)).resolves.toBe(param);

    expect(resolveFaker).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('在首次结束后再次调用', async () => {
    expect(resolveFaker).toHaveBeenCalledTimes(0);
    expect(fetch).toHaveBeenCalledTimes(0);

    await expect(promiseAutoCancelWrap(param)).resolves.toBe(param);

    expect(resolveFaker).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);

    await expect(promiseAutoCancelWrap(param)).resolves.toBe(param);

    expect(resolveFaker).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('在首次结束前再次调用', async () => {
    expect(resolveFaker).toHaveBeenCalledTimes(0);
    expect(fetch).toHaveBeenCalledTimes(0);

    const first = promiseAutoCancelWrap(param);

    expect(fetch).toHaveBeenCalledTimes(1);

    const second = promiseAutoCancelWrap(param);

    await expect(first).rejects.toBe(error);

    expect(resolveFaker).toHaveBeenCalledTimes(0);
    expect(fetch).toHaveBeenCalledTimes(2);

    await expect(second).resolves.toBe(param);

    expect(resolveFaker).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
