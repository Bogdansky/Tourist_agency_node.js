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
        return {status: result[0][0].status}
    }
    else{
        return result[0];
    }
}

module.exports.addManager = async (json) => {
    let result = 
    await admin.query(`exec add_manager '${json.surname}','${json.name}','${json.patronymic}','${json.login}',0x${json.password}`);
    console.log(result[0][0])
    return result[0][0];
}

module.exports.removeManager = async (id) => {
    let result = await admin.query(`exec remove_manager ${id}`);
    console.log(result[0][0]);
    if (result[0][0].status){
        return {"status": result[0][0].status};
    }
    else{
        return {"error": result[0][0].error};
    }
}

module.exports.getResort = async (id) => {
    try{
        let result = await user.query(`exec get_resort ${id}`, {raw: true});
        let answer = result[0][0];
        console.log(answer);
        if (answer){
            if (answer.video != null){
                answer.video = getVideo(answer.video);
            }
            return answer;
        }
        else{
            return {error: "Неожиданная ошибка"};
        }
    }
    catch(error){
        return {error: "Неожиданная ошибка"};
    }
}

async function getVideo(id){
    let result = await user.query(`exec get_file ${id}`, {raw: true});
    return result[0][0];
}  

module.exports.showTours = async () => {
    let result = await user.query('exec show_tours',{raw: true});
    return result[0] ? result[0] : {error: "Нет туров"};
}