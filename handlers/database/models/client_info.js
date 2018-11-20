module.exports = (Sequelize, sequelize, Client) => {
    return sequelize.define('client_info', {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        client_id: {
            type: Sequelize.INTEGER,
            references:{
                model: Client,
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        },
        surname: Sequelize.STRING,
        name: Sequelize.STRING,
        patronymic: {
            type: Sequelize.STRING,
            allowNull: true
        },
        birthday: Sequelize.DATE
    });
};