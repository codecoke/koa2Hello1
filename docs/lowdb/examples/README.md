# Examples

## CLI

```js
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ posts: [] })
  .write()

const result = db.get('posts')
  .push({ name: process.argv[2] })
  .write()

console.log(result)
```

```sh
$ node cli.js hello
# [ { title: 'hello' } ]
```

## Browser

```js
import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'

const adapter = new LocalStorage('db')
const db = low(adapter)

db.defaults({ posts: [] })
  .write()

// Data is automatically saved to localStorage
db.get('posts')
  .push({ title: 'lowdb' })
  .write()
```

## Server

Please __note__ that if you're developing a local server and don't expect to get concurrent requests, it's often easier to use `file-sync` storage, which is the default.

But if you need to avoid blocking requests, you can do so by using `file-async` storage.

请__注意__，如果您正在开发本地服务器，并且不希望获得并发请求，那么使用`file-sync`存储（这是默认值）通常更容易。

但是如果您需要避免阻塞请求，可以使用`file-async`存储。

```js
const express = require('express')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

// Create server
const app = express()

// Routes
// GET /posts/:id
app.get('/posts/:id', (req, res) => {
  const post = db.get('posts')
    .find({ id: req.params.id })
    .value()

  res.send(post)
})

// POST /posts
app.post('/posts', (req, res) => {
  db.get('posts')
    .push(req.body)
    .last()
    .assign({ id: Date.now() })
    .write()
    .then(post => res.send(post))
})

// Create database instance and start server
const adapter = new FileAsync('db.json')
low(adapter)
  .then(db => {
    return db.defaults({ posts: [] })
      .write()
   })
  .then(() => {
    app.listen(3000, () => console.log('listening on port 3000'))
   })
```

## In-memory

With this adapter, calling `write` will do nothing. One use case for this adapter can be for tests.

使用这个适配器，调用`write`将不会做任何事情。
该适配器的一个用例可以用于测试。

```js
const fs = require('fs')
const low = require('low')
const FileSync = require('low/adapters/FileSync')
const Memory = require('low/adapters/Memory')

const db = low(
  process.env.NODE_ENV === 'test'
    ? new Memory()
    : new FileSync('db.json')
)

db.defaults({ posts: [] })
  .write()

db.get('posts')
  .push({ title: 'lowdb' })
  .write()
```
