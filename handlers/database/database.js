const Client = require('./models/client');
const Country = require('./models/country');
const Manager = require('./models/manager');
const Abode = require('./models/abode');
const ClientInfo = require('./models/client_info');
const Resort = require('./models/resort');
const Tour = require('./models/tour');
const Order = require('./models/order');

module.exports = (Sequelize, config) => {
    const sequelize = new Sequelize('sequelize','root','55911955',config);

    // сущности
    const client = Client(Sequelize, sequelize);
    const country = Country(Sequelize, sequelize);
    const manager = Manager(Sequelize, sequelize);
    const abode = Abode(Sequelize, sequelize);
    const clientInfo = ClientInfo(Sequelize, sequelize, clients);
    const resort = Resort(Sequelize, sequelize, countries);
    const tour = Tour(Sequelize, sequelize, resorts, managers);
    const order = Order(Sequelize, sequelize, client, tours, abodes);

    synchronizeDB([turtles,weapons,pizzas]);

    // TODO: создание связей между таблицами
    client.hasOne(clientInfo, {foreignKey: 'client_id'});
    resort.hasOne(country, {foreignKey:'id_country'});
    client.hasMany(order, {foreignKey: 'client_id'});
    abode.hasMany(order, {foreignKey: 'id_abode'});
    tour.hasMany(order, {foreignKey: 'id_tour'});
    country.hasOne(resort, {foreignKey: 'id_country'});
    resort.hasMany(tour, {foreignKey: 'resort_id'});
    manager.hasMany(tour, {foreignKey: 'id_manager'});

    return {
        client: client,
        country: country,
        manager: manager,
        abode: abode,
        clientInfo: clientInfo,
        resort: resort,
        tour: tour,
        order: order,

        sequelize: sequelize,
        Sequelize: Sequelize,
    };
};

function synchronizeDB(tables){
    tables.forEach((table) => {
        table.sync({force:true});
    })
}