const Koa = require('koa');

const app = new Koa();

app.use(async (ctx,next) => {
  console.log('async 1');
  await next();
  console.log('async end');
  ctx.response.type = 'text/html';
  ctx.response.body = '<h1>hello koa2!</h1>';
});

app.use(async (ctx,next) => {
  console.log(`'async 2 ${ctx.request.method} ${ctx.request.url}'`);
  await next();
  console.log('async 2.2');
});

app.use(async (ctx,next) => {
  console.log('async 3.1');
  await next();
  console.log('async 3.2');
});


app.listen(3000);
console.log('[demo] app start at port 3000...!');