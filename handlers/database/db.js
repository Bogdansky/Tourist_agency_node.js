const Sequelize = require('sequelize');
const config = require('./config.json');
const admin = new Sequelize('tourist_agency','admin_login', 'iamboss', config);
const user = new Sequelize('tourist_agency','user_login', 'iamuser', config);
const manager = new Sequelize('tourist_agency','manager_login', 'iammanager', config);
const megaadmin = new Sequelize('tourist_agency','admin','55911955',config);

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
    let result = await admin.query(`exec sign_up '${login}',0x${password}`, {raw: true});
    return result[0][0];
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

module.exports.getFile = async (id) => {
    let result = await user.query(`exec get_file ${id}`, {raw: true});
    return result[0][0];
}  

module.exports.showTours = async () => {
    let result = await user.query('exec show_tours',{raw: true});
    return result[0] ? result[0] : {error: "Нет туров"};
}


module.exports.getCost = async (tour, abode) => {
    let result = await user.query(`exec getCosts ${tour},${abode}`,{raw: true});
    return result[0][0].error ? {error: result[0][0].error} : result[0][0];
}

module.exports.makeOrder = async (client, tour, cost, start, abode) => {
    let result = await user.query(`exec make_order ${client},${tour},${cost},'${start}',${abode}`, {raw: true});
    return result[0][0].error ? {error: result[0][0].error} : result[0][0];
}

module.exports.showOrders = async (client) => {
    let result = await user.query(`exec show_orders ${client}`,{raw: true});
    return result[0];
}

module.exports.getClientInfo = async (client) => {
    let result = await user.query(`exec get_client_info ${client}`);
    if (result[0][0].error){
        return {error: result[0][0].error};
    }
    else{
        return result[0][0];
    }
}

module.exports.updateClientInfo = async (client,surname,name,patronymic,birthday,photo) => {
    try{
        let result;
        if (photo){
            result = await 
                user.query(`exec update_client ${client},'${surname}','${name}','${patronymic}','${birthday}',${photo}`, {raw: true}); 
        }
        else{
            result = await 
                user.query(`exec update_client ${client},'${surname}','${name}','${patronymic}','${birthday}'`, {raw: true});
        }
        if(result[0][0].error){
            return {error: result[0][0].error};
        }
        else{
            return result[0][0];
        }
    }
    catch(error){
        return {error};
    }
}

module.exports.uploadFile = async (path,name,type) => {
    let result = await megaadmin.query(`exec upload_file '${path}','${name}','${type}'`);
    return result[0][0];
}

module.exports.addPhoto = async (photo,client) => {
    let result = await user.query(`exec add_photo ${photo},${client}`);
    return result[0][0];
}

module.exports.addVideo = async (video,resort) => {
    let result = await manager.query(`exec add_video ${video},${resort}`);
    return result[0][0];
}

module.exports.showClients = async () => {
    let result = await manager.query('exec show_clients', {raw: true});
    return result[0];
}

module.exports.showResorts = async () => {
    let result = await manager.query('exec get_all_resorts', {raw: true});
    return result[0];
}

module.exports.showCountries = async () => {
    let result = await manager.query('exec show_countries', {raw: true});
    return result[0];
}

module.exports.block = async (type,id) => {
    let result = await manager.query(`exec add_to_black_list '${type}',${id}`, {raw: true});
    return result[0][0];
}

module.exports.unblock = async (type,id) => {
    let result = await manager.query(`exec remove_from_black_list '${type}',${id}`, {raw: true});
    return result[0][0];
}

module.exports.deleteClient = async (id) => {
    let result = await manager.query(`exec drop_client ${id}`, {raw: true});
    return result[0][0];
}

module.exports.deleteResort = async (id) => {
    let result = await manager.query(`exec drop_resort ${id}`, {raw: true});
    return result[0][0];
}

module.exports.addResort = async (country,resort) => {
    let result = await manager.query(`exec add_resort '${country}','${resort}'`, {raw: true});
    return result[0][0];
}

module.exports.removeTour = async (id) => {
    let result = await manager.query(`exec drop_tour ${id}`);
    return result[0][0];
}

module.exports.addTour = async (name,duration,resort,managerId) => {
    let result = await manager.query(`exec add_tour '${name}',${duration},'${resort}',${managerId}`, {raw: true});
    return result[0][0];
}

module.exports.dropBase = async () => {
    let result = await manager.query('exec drop_base', {raw: true});
    return result[0][0];
}