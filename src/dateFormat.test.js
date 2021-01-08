import { dateFormat } from './dateFormat.js';

describe('日期格式化 测试', () => {
  it('YYYY年MM月DD日 hh点mm分ss秒xxx 季度q', () => {
    var str = dateFormat(new Date('2000/3/5 12:13:4:800'), 'YYYY年MM月DD日 hh点mm分ss秒xxx 季度q')
    expect(str).toBe('2000年03月05日 12点13分04秒800 季度1');
  });

  it('Y年M月D日 h点m分s秒x ', () => {
    var str = dateFormat(new Date('2000/3/5 12:13:4:800'), 'Y年M月D日 h点m分s秒x')
    expect(str).toBe('2000年3月5日 12点13分4秒800');
  });
})