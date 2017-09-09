const Koa = require('koa');

const app = new Koa();

app.use(async (ctx,next) => {
  console.log('async 1 begin -----');
  await next();
  console.log('async 1 end -----\n');
  ctx.response.type = 'text/html';
  ctx.response.body = '<h1>hello koa2!</h1>';
});

app.use(async (ctx,next) => {
  console.log(` async 2 begin ${ctx.request.method} ${ctx.request.url}`);
  await next();
  console.log(' async 2 end');
});

app.use(async (ctx,next) => {
  console.log('   async 3 begin');
  await next();
  console.log('   async 3 end');
});


app.listen(3000,(ctx) => {
  console.log('[demo] app start at port 3000...!');
});