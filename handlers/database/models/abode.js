module.exports = (Sequelize, sequelize) => {
    return sequelize.define('adobes', {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        hotel_class: Sequelize.STRING
    });
};