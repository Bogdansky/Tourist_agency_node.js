const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

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

app.get('/admin/readall', getManagers, send)

async function getManagers(request, response, next){
  let managers = await database.getManagers();
  request.result = managers;
  next();
}

async function signIn(request, response, next){
  let result =  await database.signIn(request.body.login, request.body.password);
  if (result.error){
    request.result = {error: result.error};
    next();
  }
  else{
    request.session.userType = result.type_of_user;
    request.session.id = result.result_id;
    response.redirect(`/${result.type_of_user}/index.html`)
  }
}

function signUp(request,response,next){
  let result = database.signUp(request.body.login, request.body.password);
  if (result.last_id){
    request.session.userId = result.last_id;
    response.sendFile(`/client/index.html`)
  }
  else{
    request.result = {status: result.status};
    next();
  }
}

function send(request, response){
  response.json(request.result);
}