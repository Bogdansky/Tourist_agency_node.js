const Sequelize = require('sequelize');
const config = require('./config.json');
const admin = new Sequelize('tourist_agency','admin_login', 'iamboss', config);
const user = new Sequelize('tourist_agency','user_login', 'iamuser', config);
const manager = new Sequelize('tourist_agency','manager_login', 'iammanager', config);

module.exports.signIn = async (login, password) => {
    try{
        let result = await admin.query(`exec sign_in '${login}',0x${password}`, {raw: true});
        let user = result[0][0]; // результат запроса
        console.log(result[0][0]);
        return user;
    }
    catch (error) {
        console.log(error.message);
    }
}

module.exports.signUp = async (login, password) => {
    await admin.query(`exec sign_up '${login}',0x${password}`, {raw: true}).then(result => {
        return result[0][0];
    }).catch ((error) => {
        return error.message;
    });
}

module.exports.getManagers = async () => {
    let result = await admin.query('exec get_managers', {raw: true});
    if (result[0][0].status){
        return {status}
    }
    else{
        return result[0];
    }
}