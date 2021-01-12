# @danep/utils 简单的工具库

### 优点

- 无依赖，无副作用
- 经过测试，代码覆盖率100%

### dateFormat 格式化日期

```typescript
type dateFormat = (date: Date, fmt: string) => string

dateFormat(new Date(), 'YYYY-M-D')  // 2020/1/1

// 若小于占位符长度，补0
dateFormat(new Date(), 'YYYY-MM-DD')// 2020/01/01
```

| 占位符 | 说明 |
| ------ | ---- |
| Y      | 年   |
| M      | 月   |
| D      | 日   |
| h      | 时   |
| m      | 分   |
| s      | 秒   |
| x      | 毫秒 |
| q      | 季度 |

### urlParse 解析url

```typescript
type urlParse = (url: string) => object

urlParse('www.baidu.com?a=1&b=2&c=3#hash') // { a: '1', b: '2', c: '3' }
urlParse('http://www.baidu.com') // {}
urlParse('www.baidu.com?a=%E5%93%88') // { a: '哈' } , 参数解码
urlParse('www.baidu.com?a&b=&c=3') // { a: 'true', b: 'true', c: '3' } , 空字符串解析成true
```

### isValidArray 判定有效数组

```typescript
type isValidArray = (val: any) => boolean

// 是数组并且长度 >0
isValidArray([]) //false
isValidArray([1]) //true
```

### isPromise 判定promise

```typescript
type isPromise = (val: any) => boolean

isPromise( new Promise( ()=>{} ) ) // true
isPromise( { then: () => {}, catch: () => {} } ) // true
```

### getValue 获取值

如果参数是个函数，会返回函数的值，否知返回参数

```typescript
type getValue = (val: any) => any

getValue(1) // 1
getValue(() => true) //true
```



### promiseCache 缓存promise

```typescript
type promiseCreator<T> = (arg) => Promise<T>

type cahce<U> = {
  get: (arg: U) => any,
  set: <T> (val: T, arg: U) => T
}

type promiseCache<T> = (
  promiseCreator: promiseCreator<T>,
  cahce?: cahce<any>
) => promiseCreator<T>

function getUserId() {
  return fetch().then(id => promise.reslove(id))
}

getUserId = promiseCache(getUserId)

getUserId() // 第一次，fetch 发出请求
getUserId() // 第二次，请缓存读取，不执行fetch
getUserId.cahce.get() // 主动从缓存读取

// 默认缓存媒介
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

// 自定义媒介
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

function getUserInfo(id) {
  return fetch(id).then(user => promise.reslove(user))
}

getUserInfo = promiseCache(getUserInfo, createCache())

getUserInfo(1) // 第一次获取1，fetch 发出请求
getUserInfo(1) // 第二次获取1，请缓存读取，不执行fetch
getUserInfo(2) // 第一次获取2，fetch 发出请求

```

### promiseCancel 取消promise

```typescript
type promiseCreator<T> = (arg) => Promise<T>
type promiseCancel<T, U> =
  (promiseCreator: promiseCreator<T>)
    => promiseCreator<[Promise<T | U>, (error: U) => void]>

function getUserId() {
  return fetch().then(id => promise.reslove(id))
}

getUserId = promiseCancel(getUserId)
const [promise,cancel] = getUserId()
cancel(error) // 调用 cancel ，会使promise进入 rejected 状态，值为error

```



### promiseAutoCancel 自动取消promise

```typescript
type promiseCreator<T> = (arg) => Promise<T>
type promiseAutoCancel<T> = (
  promiseCreator: promiseCreator<T>,
  error: any | (() => any)
) => promiseCreator<T>

function getUserId() {
  return fetch().then(id => promise.reslove(id))
}

getUserId = promiseAutoCancel(getUserId, new Error('自动取消'))

getUserId() // 自动reject， throw Error('自动取消')
getUserId() // 正常
```

