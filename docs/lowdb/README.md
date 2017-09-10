# Lowdb

```js
db.get('posts')
  .push({ id: 1, title: 'lowdb is awesome'})
  .write()
```

## Usage

```sh
npm install lowdb
```

```js
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults
db.defaults({ posts: [], user: {} })
  .write()

// Add a post
db.get('posts')
  .push({ id: 1, title: 'lowdb is awesome'})
  .write()

// Set a user using Lodash shorthand syntax
db.set('user.name', 'typicode')
  .write()
```

Data is saved to `db.json`

```json
{
  "posts": [
    { "id": 1, "title": "lowdb is awesome"}
  ],
  "user": {
    "name": "typicode"
  }
}
```

You can use any [lodash](https://lodash.com/docs) function like [`_.get`](https://lodash.com/docs#get) and [`_.find`](https://lodash.com/docs#find) with shorthand syntax.

```js
// Use .value() instead of .write() if you're only reading from db
// 如果您只从数据库读取，请使用.value（）而不是.write（）
db.get('posts')
  .find({ id: 1 })
  .value()
```

Lowdb is perfect for CLIs, small servers, Electron apps and npm packages in general.

It supports __Node__, the __browser__ and uses __lodash API__, so it's very simple to learn. Actually, if you know Lodash, you already know how to use lowdb :wink:

* [Usage examples](https://github.com/typicode/lowdb/tree/master/examples)
  * [CLI](https://github.com/typicode/lowdb/tree/master/examples#cli)
  * [Browser](https://github.com/typicode/lowdb/tree/master/examples#browser)
  * [Server](https://github.com/typicode/lowdb/tree/master/examples#server)
  * [In-memory](https://github.com/typicode/lowdb/tree/master/examples#in-memory)
* [JSFiddle live example](https://jsfiddle.net/typicode/4kd7xxbu/)

__Important__ lowdb doesn't support Cluster and may have issues with very large JSON files (~200MB).

__重要__ lowdb不支持群集，并且JSON文件过大（〜200MB）可能会遇到问题。

## Install

```sh
npm install lowdb
```

Alternatively, if you're using [yarn](https://yarnpkg.com/)

```sh
yarn add lowdb
```

A UMD build is also available on [unpkg](https://unpkg.com/) for testing and quick prototyping:

```html
<script src="https://unpkg.com/lodash@4/lodash.min.js"></script>
<script src="https://unpkg.com/lowdb@0.17/dist/low.min.js"></script>
<script src="https://unpkg.com/lowdb@0.17/dist/LocalStorage.min.js"></script>
<script>
  var adapter = new LocalStorage('db')
  var db = low(adapter)
</script>
```

## API

__low(adapter)__

Returns a lodash [chain](https://lodash.com/docs/4.17.4#chain) with additional properties and functions described below.

返回一个lodash [chain 链式调用]（https://lodash.com/docs/4.17.4#chain），具有下面描述的附加属性和功能。

__db.[...].write()__

__db.[...].value()__

`write()` is syntactic sugar for calling `value()` and `db.write()` in one line. 

`write（）`是用于在一行中同时调用`value（）`和`db.write（）`'句法糖。

On the other hand, `value()` is just [\_.protoype.value()](https://lodash.com/docs/4.17.4#prototype-value) and should be used to execute a chain that doesn't change database state.

```js
db.set('user.name', 'typicode')
  .write()

// is equivalent to
db.set('user.name', 'typicode')
  .value()

db.write()
```

__db.___

Database lodash instance. Use it to add your own utility functions or third-party mixins like [underscore-contrib](https://github.com/documentcloud/underscore-contrib) or [lodash-id](https://github.com/typicode/lodash-id).

```js
db._.mixin({
  second: function(array) {
    return array[1]
  }
})

db.get('posts')
  .second()
  .value()
```

__db.getState()__

Returns database state.

```js
db.getState() // { posts: [ ... ] }
```

__db.setState(newState)__

Replaces database state.

```js
const newState = {}
db.setState(newState)
```

__db.write()__

Persists database using `adapter.write` (depending on the adapter, may return a promise).

使用`adapter.write`保持数据库（取决于适配器，可能会返回`Promise`对象）。

```js
// With lowdb/adapters/FileSync
db.write()
console.log('State has been saved')

// With lowdb/adapters/FileAsync
db.write()
  .then(() => console.log('State has been saved'))
```

__db.read()__

Reads source using `storage.read` option (depending on the adapter, may return a promise).

```js
// With lowdb/FileSync
db.read()
console.log('State has been updated')

// With lowdb/FileAsync
db.write()
  .then(() => console.log('State has been updated'))
```

## Adapters API

Please note this only applies to adapters bundled with Lowdb. Third-party adapters may have different options.

请注意，这仅适用于与Lowdb绑定的适配器。 第三方适配器可能有不同的选项。

For convenience, `FileSync`, `FileAsync` and `LocalBrowser` accept the following options:

* __defaultValue__ if file doesn't exist, this value will be used to set the initial state (default: `{}`)
* __serialize/deserialize__ functions used before writing and after reading (default: `JSON.stringify` and `JSON.parse`)

```js
const adapter = new FileSync('array.yaml', {
  defaultValue: [],
  serialize: (array) => toYamlString(array),
  deserialize: (string) => fromYamlString(string)
})
```

## Guide

### How to query

With lowdb, you get access to the entire [lodash API](http://lodash.com/), so there are many ways to query and manipulate data. Here are a few examples to get you started.

Please note that data is returned by reference, this means that modifications to returned objects may change the database. To avoid such behaviour, you need to use `.cloneDeep()`.

使用lowdb，您可以访问整个[lodash API]（http://lodash.com/），因此有很多方法来查询和操作数据。 以下是让您开始的几个例子。

请注意，通过引用返回数据，这意味着对返回对象的修改可能会更改数据库。 为了避免这种行为，你需要使用`.cloneDeep（）`。

Also, the execution of methods is lazy, that is, execution is deferred until `.value()` or `.write()` is called.

而且，方法的执行是懒惰的，也就是执行被推迟直到`.value（）`或`.write（）`被调用。

#### Examples

Check if posts exists.

```js
db.has('posts')
  .value()
```

Set posts.

```js
db.set('posts', [])
  .write()
```

Sort the top five posts.

```js
db.get('posts')
  .filter({published: true})
  .sortBy('views')
  .take(5)
  .value()
```

Get post titles.

```js
db.get('posts')
  .map('title')
  .value()
```

Get the number of posts.

```js
db.get('posts')
  .size()
  .value()
```

Get the title of first post using a path.

```js
db.get('posts[0].title')
  .value()
```

Update a post.

```js
db.get('posts')
  .find({ title: 'low!' })
  .assign({ title: 'hi!'})
  .write()
```

Remove posts.

```js
db.get('posts')
  .remove({ title: 'low!' })
  .write()
```

Remove a property.

```js
db.unset('user.name')
  .write()
```

Make a deep clone of posts.

```js
db.get('posts')
  .cloneDeep()
  .value()
```

### How to use id based resources

Being able to get data using an id can be quite useful, particularly in servers. To add id-based resources support to lowdb, you have 2 options.

[shortid](https://github.com/dylang/shortid) is more minimalist and returns a unique id that you can use when creating resources.

```js
const shortid = require('shortid')

const postId = db
  .get('posts')
  .push({ id: shortid.generate(), title: 'low!' })
  .write()
  .id

const post = db
  .get('posts')
  .find({ id: postId })
  .value()
```

[lodash-id](https://github.com/typicode/lodash-id) provides a set of helpers for creating and manipulating id-based resources.

```js
const lodashId = require('lodash-id')
const db = low('db.json')

db._.mixin(lodashId)

const post = db
  .get('posts')
  .insert({ title: 'low!' })
  .write()

const post = db
  .get('posts')
  .getById(post.id)
  .value()
```

### How to create custom adapters

`low()` accepts custom Adapter, so you can virtually save your data to any storage using any format.

```js
class MyStorage {
  constructor() {
    // ...
  }

  read() {
    // Should return data (object or array) or a Promise
  }

  write(data) {
    // Should return nothing or a Promise
  }
}

const adapter = new MyStorage(args)
const db = low()
```

See [src/adapters](src/adapters) for examples.

### How to encrypt data

`FileSync`, `FileAsync` and `LocalStorage` accept custom `serialize` and `deserialize` functions. You can use them to add encryption logic.

 您可以使用它们来添加加密逻辑。

```js
const adapter = new FileSync('db.json', {
  serialize: (data) => encrypt(JSON.stringify(data))
  deserialize: (data) => JSON.parse(decrypt(data))
})
```

## Changelog

See changes for each version in the [release notes](https://github.com/typicode/lowdb/releases).

## Limits

Lowdb is a convenient method for storing data without setting up a database server. It is fast enough and safe to be used as an embedded database.

However, if you seek high performance and scalability more than simplicity, you should probably stick to traditional databases like MongoDB.

Lowdb是在不设置数据库服务器的情况下存储数据的方便方法。 它是足够快和安全的用作嵌入式数据库。

但是，如果您比简单性要求更高的性能和可扩展性，那么您应该坚持使用MongoDB等传统数据库。

## License

MIT - [Typicode :cactus:](https://github.com/typicode)
