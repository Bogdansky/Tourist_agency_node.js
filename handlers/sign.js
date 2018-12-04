const crypto = require('crypto');

module.exports.processing = (request, responce, next) => {
let login = request.body.login;
let password = request.body.password;
request.body.password = crypto.createHmac('sha1', login).update(password).digest('hex');
next();
}