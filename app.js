const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const file = require('./handlers/files');

let resortId = 0;
let userId = 0;

let app = express();

const validation = require('./handlers/valid');
const sign = require('./handlers/sign');
const database = require('./handlers/database/db');

const valid = validation.validLog;
const processing = sign.processing;

app.use('/index', express.static(__dirname + '/public/main'));
app.use('/client', express.static(__dirname + '/public/client'));
app.use('/manager', express.static(__dirname + '/public/manager'));
app.use('/admin', express.static(__dirname + '/public/admin'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.redirect('/index/login.html');
});

app.listen(3000, () => {
  console.log('Tourist agency app listening on port 3000!');
});

app.post('/login', valid, processing, signIn, send)

app.post('/signup', valid, processing, signUp, send)

app.get('/admin/readall', getManagers, send);
app.post('/admin/create', processing, createManager, send);
app.post('/admin/remove', removeManager, (request, response) => {
  console.log(request.result);
  response.json(request.result);
});

async function getManagers(request, response, next){
  let managers = await database.getManagers();
  request.result = managers;
  next();
}

async function signIn(request, response, next){
  let result =  await database.signIn(request.body.login, request.body.password);
  if (result.error){
    request.result = {error: result.error};
    response.set('Content-Type','text/html')
    response.send(`${result.error}<a href="/">Вернуться обратно</a>`);
  }
  else{
    userId = result.result_id;
    response.redirect(`/${result.type_of_user}/index.html`)
  }
}

async function signUp(request,response,next){
  let result = database.signUp(request.body.login, request.body.password);
  if (result.last_id){
    userId = result.last_id;
    response.redirect(`/client/index.html`)
  }
  else{
    request.result = {status: result.status};
    next();
  }
}

async function createManager(request,response,next){
  if (request.body){
    request.result = await database.addManager(request.body);
  }
  else{
    request.result = {error: "Неопределён менеджер"};
  }
  next();
}

async function removeManager(request,response,next){
  if (request.body){
    request.result = await database.removeManager(request.body.id);
  }
  else{
    request.result = {error: "Неопределён менеджер"};
  }
  next();
}

function send(request, response){
  response.json(request.result);
} 

app.get('/client/show_tours', showTours, send);
app.get('/client/show_orders', showOrders, send);
app.get('/client/show_resort', checkId, (request,response) => {
  response.redirect('/client/resort.html');
});
app.get('/client/read_resort', getResort, send);
app.get('/client/getcost', getCost, send);
app.get('/client/info', getInfo, send);
app.post('/client/create_order', makeOrder, send);
app.post('/client/update', updateClient, send);

async function checkId(request,response,next){
  request.result = await database.getResort(request.query.id);
  if (!request.result.error){
    request.session.resortId = request.query.id;
    resortId = request.query.id;
  }
  next();
}

async function getResort(request,response,next){
  let result = await database.getResort(resortId);
  if(result.error){
    request.result = {error: result.error};
  }
  else{
    await analizeClientRequest(result);
    console.log('Here');
    request.result = result;
  }
  next();
}

async function analizeClientRequest(result){
  let videoName=null;
  let photoName=null;
  if (result.video){
    let name = `${__dirname}/public/client/video/`;
    videoName = await file.createFile(result.video,name,'video');
    result.videoName = videoName;
  }
  if (result.photo){
    let name = `${__dirname}\\public\\client\\images\\`;
    console.log(name);
    photoName = await file.createFile(result.photo,name,'images');
    result.photoName = photoName;
  }
  return;
}

async function showTours(request,response,next){
  request.result = await database.showTours();
  next();
}

async function getCost(request,response,next){
  let result = await database.getCost(request.query.tourId,
    request.query.abode_id);
  request.result = result;
  next();
}

async function makeOrder(request, response, next){
  let result = await
   database.makeOrder(userId, request.body.tour,request.body.cost,
    request.body.start,request.body.abode);
  request.result = result;
  next();
}

async function showOrders(request,response,next){
  let result = await database.showOrders(userId);
  if (result[0].error){
    request.result = {error: result[0].error};
  }
  else{
    request.result = result;
  }
  next();
}

async function getInfo(request, response, next){
  let result = await database.getClientInfo(userId);
  if (result.photo){
    await analizeClientRequest(result);
  }
  console.log(result);
  request.result = result;
  next();
}

async function updateClient(request,response,next){
  let result = await database.updateClientInfo(userId,request.body.surname,request.body.name,request.body.patronymic,request.body.birthday,request.body.photo);
  request.result = result;
  next();
}