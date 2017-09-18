const Koa = require('koa');

const app = new Koa();

app.use( (ctx,next) => {
  console.log('   async 0 begin');
  // await next();
  console.log('   async 0 end');
  return ;
});

app.use(async (ctx,next) => {
  let start = new Date().getTime();
  console.log('async 1 begin -----');
  ctx.state.test1 = '1';
  await next();
  let ms = new Date().getTime() - start;
  console.log(`async 1 end runtime: ${ms} ms-----\n`);
  // ctx.response.type = 'text/html';
  // ctx.response.body = '<h1>hello koa2!</h1>';
});

app.use(async (ctx,next) => {
  console.log(` async 2 begin ${ctx.request.method} ${ctx.request.url}`);
  await next();
  console.log(' async 2 end');
});

app.use(async (ctx,next) => {
  console.log('   async 3 begin');
  // await next();
  console.log('   async 3 end');
});


app.listen(3000,(ctx) => {
  console.log('[demo] app start at port 3000...!');
});