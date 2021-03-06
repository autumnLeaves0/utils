export function dateFormat (date, fmt) {
  const o = {
    'Y+': date.getFullYear(), // 年
    'M+': date.getMonth() + 1, // 月份
    'D+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'x+': date.getMilliseconds() // 毫秒
  };
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, ('' + o[k]).padStart(RegExp.$1.length, 0));
  }
  return fmt;
}
