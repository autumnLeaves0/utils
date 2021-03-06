import { urlParse } from './urlParse.js';

describe('url解析 测试', () => {
  it('普通解析', () => {
    let o = urlParse('www.baidu.com?a=1&b=2&c=3#hash');
    expect(o).toEqual({ a: '1', b: '2', c: '3' });

    o = urlParse('?a=1&b=2&c=3#hash');
    expect(o).toEqual({ a: '1', b: '2', c: '3' });

    o = urlParse('a=1&b=2&c=3#hash');
    expect(o).toEqual({ a: '1', b: '2', c: '3' });

    o = urlParse('http://www.baidu.com');
    expect(o).toEqual({});
  });

  it('参数解码', () => {
    const o = urlParse('www.baidu.com?a=%E5%93%88');
    expect(o).toEqual({ a: '哈' });
  });

  it('空字符串解析成true', () => {
    const o = urlParse('www.baidu.com?a&b=&c=3');
    expect(o).toEqual({ a: 'true', b: 'true', c: '3' });
  });
});
