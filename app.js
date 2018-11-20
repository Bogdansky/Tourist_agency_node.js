var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.redirect('main/login.html');
});

app.listen(3000, function () {
  console.log('Tourist agency app listening on port 3000!');
});

