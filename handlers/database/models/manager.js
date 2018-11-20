module.exports = (Sequelize, sequelize) => {
    return sequelize.define('managers', {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        surname: Sequelize.STRING,
        name: Sequelize.STRING,
        patronymic: Sequelize.STRING,
        birthday: Sequelize.DATE
    });
};