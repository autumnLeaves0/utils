export function urlParse(url) {
  if (/^https?:\/\/[^?]+\??([^#]*)/.test(url)){ url = RegExp.$1 || ''
  console.log( url, RegExp.$1,RegExp.$2,RegExp.$3)}
  var reg = /([^&=?]+)=?([^&=?]*?)(&|$|#.*)/g
  var o = {}
  while (reg.test(url)) {
    o[RegExp.$1] = decodeURIComponent(RegExp.$2) || 'true'
  }
  return o;
}