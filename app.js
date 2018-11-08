var express = require('express');
var app = express();

app.use('/static', express.static('/public'));

app.get('/index', function (req, res) {
  res.send('index');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
