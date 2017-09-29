const Koa = require('koa');
const app = new Koa();
const http = require('http');
const uuid = require('./lib/mf.uuid.js');
const util = require('util');
const fs = require('fs');

// util.isObject(util);

let rstr ='<h1>hello class!</h1>';


const CodeCokeClass = class _CodeCokeClassRoot {
  constructor(){
    if(new.target === _CodeCokeClassRoot){
      console.log('new target name'+ new.target.name);
    }
    this.rootSuper = _CodeCokeClassRoot;
    // this.super = _CodeCokeClassRoot.getSuper() ;
  }
  get prop(){
    return 'prop get';
  }
  set prop(arg){
    return 'prop set';
  }
  getMemberOf(obj){
    return Object.getOwnPropertyNames(obj || this);
  }
  
  static setRootIni(){
    // console.log(this.name);
    console.log('rootSuper.setRootIni() ' + _CodeCokeClassRoot.name);
  }

  static set(){
    return '_CodeCokeClassRoot static set return';
  }
  dosomething(){
  }

};

class CodeCokeGo extends CodeCokeClass {
  constructor(){
    super();
    // this.super = this.rootSuper;
    // this.rootSuper.setRootIni();
   
    console.log('this.getMemberOf() :'+ this.getMemberOf());
    console.log('this.getMemberOf(this.rootSuper) :' + this.getMemberOf(this.rootSuper));
    // console.log('this.rootSuper.name :' + this.rootSuper.name);
    // console.log('getProtoOf : ' +  this.getProtoOf().prop);

  }
}








const coc = new CodeCokeGo();
let isProto = Object.getPrototypeOf(CodeCokeGo) === CodeCokeClass ;
console.log('cocgo == cocclass :' + isProto);

// coc.getProtoOf(coc.rootSuper);
// coc.rootSuper.setRootIni();
coc.prop='coc prop =';

rstr += '<br>coc prop get:'+ (coc.prop);
rstr += '<br>coc name:'+ (coc.name);
rstr += '<br>coc rootSuper.name:'+ (coc.rootSuper.name);
rstr += '<br>coc rootSuper.set():'+ (coc.rootSuper.set());
rstr += '<br>uuid v4:'+ uuid.v4();



// console.log(uuid.byteToHex);

app.use(async (ctx,next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}   ...`);
  await next();
  ctx.body =`
  ${rstr}

  <br/>${ctx.host}
  <br/>${ctx.hostname}
  <br/>v1: ${uuid.v1()}
  <br/>v11: ${uuid.v11()}
  <br/>v11time: ${uuid.time(uuid.v11())}
  <br/>v1: ${uuid.v1()}
  <br/>v1time: ${uuid.time(uuid.v1())}
  <br/>v4: ${uuid.v4()}
  <textarea rows="10" cols="80">
  '${uuid.byteToHex.join('\',\'')}'
  </textarea>
  `;
});
app.use(async (ctx,next) => {
  console.log('hello a3');
  // await next();
});

app.on('error',(err,ctx)=>{
  console.log('find err app on error:');
  console.error(err);
});

let server = http.createServer(app.callback());
let _port = process.env.PORT || 3001 ;
server.listen(_port);

// bind process
process.on('uncaughtException', function (e) {
  console.log('uncaughtException from process', e);
});
process.on('unhandledRejection', (e) => {
  console.log('unhandledRejection from process', e);
});
process.on('rejectionHandled', (e) => {
  console.log('rejectionHandled from process', e);
});