import {
  isValidArray,
  getValue,
  isPromise
} from './type.js';

describe('isValidArray 测试', () => {
  it('非数组', () => {
    expect(isValidArray(null)).toBe(false);
    expect(isValidArray(undefined)).toBe(false);
    expect(isValidArray(1)).toBe(false);
    expect(isValidArray('')).toBe(false);
  });
  it('空数组', () => {
    expect(isValidArray([])).toBe(false);
  });
  it('数组', () => {
    expect(isValidArray([1])).toBe(true);
    expect(isValidArray(new Array(6))).toBe(true);
  });
});

describe('getValue 测试', () => {
  it('数值', () => {
    expect(getValue(null)).toBe(null);
    expect(getValue(undefined)).toBe(undefined);
    expect(getValue(1)).toBe(1);
    expect(getValue('')).toBe('');
  });
  it('函数', () => {
    expect(getValue(() => null)).toBe(null);
    expect(getValue(() => undefined)).toBe(undefined);
    expect(getValue(() => 1)).toBe(1);
    expect(getValue(() => '')).toBe('');
  });
});

describe('isPromise 测试', () => {
  it('非 Promise', () => {
    expect(isPromise(null)).toBe(false);
    expect(isPromise(undefined)).toBe(false);
    expect(isPromise(NaN)).toBe(false);
    expect(isPromise(1)).toBe(false);
    expect(isPromise('')).toBe(false);
  });
  it('类 Promise', () => {
    expect(isPromise({ then: () => {} })).toBe(false);
    expect(isPromise({ catch: () => {} })).toBe(false);
    expect(isPromise({ then: () => {}, catch: () => {} })).toBe(true);
  });
  it('Promise', () => {
    expect(isPromise(new Promise(() => {}))).toBe(true);
    expect(isPromise(Promise.resolve())).toBe(true);
  });
});
