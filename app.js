const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const file = require('./handlers/files');
const multer = require('multer');

let resortId = 0;
let userId = 0;

let app = express();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

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
    console.log(userId);
    response.redirect(`/${result.type_of_user}/index.html`)
  }
}

async function signUp(request,response,next){
  let result = await database.signUp(request.body.login, request.body.password);
  console.log(result);
  if (result.last_id){
    userId = result.last_id;
    response.redirect(`/client/index.html`)
  }
  else{
    response.set('Content-Type','text/html');
    response.send(`${result.status}<a href="/">Вернуться обратно</a>`);
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
app.post('/client/upload', upload.single('file'), fileReady);

async function fileReady(req, res, next){
  if (req.file){
    let result = await database.uploadFile(`${__dirname}\\uploads\\`, req.file.originalname,'picture');
    console.log(result);
    if (result.result && userId){
      let added = await database.addPhoto(result.result, userId);
      res.set('Content-Type','text/html')
      res.send(`${added.message || added.error}<a href="/client/index.html">Вернуться обратно</a>`);
    }
    else{
      res.set('Content-Type','text/html')
      res.send(`Загружен успешно<a href="/client/index.html">Вернуться обратно</a>`);
    }
  }
  else{
    res.set('Content-Type','text/html')
    res.send(`Загрузка не удалась<a href="/client/index.html">Вернуться обратно</a>`);
  }
}

async function checkId(request,response,next){
  request.result = await database.getResort(request.query.id);
  if (!request.result.error){
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
  if (result[0] && result[0].error){
    request.result = {error: result[0].error};
  }
  else{
    request.result = result;
  }
  next();
}

async function getInfo(request, response, next){
  console.log(userId);
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

app.get('/manager/show_clients', getClients, send);
app.get('/manager/show_resorts', getResorts, send);
app.get('/manager/show_countries', getCountries, send);
app.get('/manager/client_block', blockClient, send);
app.get('/manager/resort_block', blockResort, send);
app.get('/manager/destroy_base');
app.post('/manager/delete_client', deleteClient, send);
app.post('/manager/delete_resort', deleteResort, send);
app.post('/manager/add_resort', addResort, send);
app.post('/manager/add_tour', addTour, send);
app.post('/manager/prepare_video', getId, send);
app.post('/manager/upload', upload.single('file'), videoReady);
app.post('/manager/drop_tour', removeTour, send);

async function getId(request,response,next){

}

async function videoReady(req, res, next){ 
  if (req.file){
    let result = await database.uploadFile(`${__dirname}\\uploads\\`, req.file.originalname,'picture');
    console.log(result);
    if (result.result && userId){
      let added = await database.addVideo(result.result, userId);
      res.set('Content-Type','text/html')
      res.send(`${added.message || added.error}<a href="/client/index.html">Вернуться обратно</a>`);
    }
    else{
      res.set('Content-Type','text/html')
      res.send(`Загружен успешно<a href="/client/index.html">Вернуться обратно</a>`);
    }
  }
  else{
    res.set('Content-Type','text/html')
    res.send(`Загрузка не удалась<a href="/client/index.html">Вернуться обратно</a>`);
  }
}

async function getClients(request,response,next){
  let result = await database.showClients();
  console.log(result);
  request.result = result;
  next();
}

async function getResorts(request,response,next){
  let result = await database.showResorts();
  request.result = result;
  next();
}

async function getCountries(request,response,next){
  let result = await database.showCountries();
  request.result = result;
  next();
}

async function blockClient(request,response,next){
  let result = null;
  if (request.query.block==1){
    result = await database.block('client', request.query.id || -1);
  }
  else{
    result = await database.unblock('client', request.query.id || -1);
  }
  request.result = result;
  next();
}

async function blockResort(request,response,next){
  let result = null;
  console.log(request.query);
  if (request.query.block==1){
    result = await database.block('resort', request.query.id || -1);
  }
  else{
    result = await database.unblock('resort', request.query.id || -1);
  }
  request.result = result;
  next();
}

async function deleteClient(request,response,next){
  let result = await database.deleteClient(request.body.id);
  request.result = result;
  next();
}

async function deleteResort(request,response,next){
  let result = await database.deleteResort(request.body.id);
  request.result = result;
  next();
}

async function addResort(request,response,next){
  let result = await database.addResort(request.body.country,request.body.resort);
  request.result = result;
  next();
}

async function addTour(request,response,next){
  let result = await database.addTour(request.body.name,request.body.duration,request.body.resort,userId);
  request.result = result;
  next();
}

async function removeTour(request,response,next){
  let result = await database.removeTour(request.body.id);
  request.result = result;
  next();
}