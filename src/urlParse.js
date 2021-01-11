export function urlParse (url) {
  if (/^https?:\/\/[^?]+\??([^#]*)/.test(url)) {
    url = RegExp.$1 || '';
  }
  const reg = /([^&=?]+)=?([^&=?]*?)(&|$|#.*)/g;
  const o = {};
  while (reg.test(url)) {
    o[RegExp.$1] = decodeURIComponent(RegExp.$2) || 'true';
  }
  return o;
}
