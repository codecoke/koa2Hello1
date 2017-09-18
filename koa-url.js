const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const app = new Koa();

// app.use(bodyParser());

app.use(async (ctx,next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  await next();
});

// add url-route:

router.get('/hello/:name',async (ctx,next) => {
  let name = ctx.params.name;
  ctx.response.body = `<h1>hello ${name}</h1>`;
});

router.get('/',async (ctx,next) => {
  ctx.response.body ='<h1>hello !</h1>';
});

// add router mideleware

app.use(router.routes());

app.listen(3000);
console.log('app start at port 3k...');