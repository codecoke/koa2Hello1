const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const app = new Koa();

app.use(bodyParser());

app.use(async (ctx,next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  await next();
});

// add url-route:

router.get('/',async (ctx,next) => {
  // let name = ctx.params.name;
  ctx.response.body = `<h1>hello index</h1>
    <form action="/signin" method="POST">
    <p>neme:<input name="name" value="koa"></p>
    <p>password:<input name="password" value="password" type="password"></p>
    <p><button type="submit">submit</button></p>
    </form>
  `;
});

router.post('/signin',async (ctx,next) => {
  let name = ctx.request.body.name || '';
  let password = ctx.request.body.password || '';

  if (name === 'koa' && password ==='password') {
    ctx.response.body =`<h1>login ${name} !</h1>
      <p>sucess!</p>
      <p>${name}/${password}<p>
      <p><a href="/">back home</a></p>
    `;
  } else {
    ctx.response.body =`<h1>login failed !</h1>
      <p>${name}<p>
      <p>${password}<p>
      <p><a href="/">try again</a></p>
    `;
  }

  
});

// add router mideleware

app.use(router.routes());

app.listen(3000);
console.log('app start at port 3k...');