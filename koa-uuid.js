

/* 
d2fb9230-9e64-11e7-b69b-5565e5ef8b99
f59e9b20-9e64-11e7-8507-6ff50c08950b
11812010-9e65-11e7-aeaf-0b9c2fdcea92
ebdb9010-9e65-11e7-aeaf-0b9c2fdcea92
035081b0-9e66-11e7-8a74-e3b3c05dbeb6
035081b1-9e66-11e7-8a74-e3b3c05dbeb6
035081b2-9e66-11e7-8a74-e3b3c05dbeb6
a71a5e40-9e68-11e7-9112-570e983f4f56
a71a5e41-9e68-11e7-9112-570e983f4f56
a71a5e42-9e68-11e7-9112-570e983f4f5
[8,13,18,23]
*/


let str = '035081b1-9e66-11e7-8a74-e3b3c05dbeb6';
let _si = [8,12,16,20];
let arr2 =[
  str.substring(0,_si[0]),
  str.substring(_si[0]+1,_si[1]+1),
  str.substring(_si[1]+2,_si[2]+2),
  str.substring(_si[2]+3,_si[3]+3),
  str.substring(_si[3]+4),
];
let str2 = arr2.join('');
let arr3 =[
  str2.substring(0,_si[0]),
  str2.substring(_si[0],_si[1]),
  str2.substring(_si[1],_si[2]),
  str2.substring(_si[2],_si[3]),
  str2.substring(_si[3]),
];




console.log(str);
console.log(...arr2);
console.log(...arr3);




/* 
app.use(async (ctx,netx) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  
  ctx.body = `hello uuid2!

  <br>

  `;

  ${getUUIDv1time(uuid.v1()).toLocaleString()}
  ${getUUIDv1time(uuid.v1()).toLocaleString()}
  ${getUUIDv1time('d2fb9230-9e64-11e7-').toLocaleDateString()}
  ${getUUIDv1time('d2fb9230-9e64-11e7-').toUTCString()}
  ${getUUIDv1time('d2fb9230-9e64-11e7-').toLocaleTimeString()}
  ${getUUIDv1time('d2fb9230-9e64-11e7-').toLocaleDateString()}
  ${getUUIDv1time('d2fb9230-9e64-11e7-')} 
 
});



app.on('error',(err,ctx)=>{
  console.log('find err app on error:');
  console.error(err);
});

let server = http.createServer(app.callback());
let _port = process.env.PORT || 3001 ;
server.listen(_port); 
*/