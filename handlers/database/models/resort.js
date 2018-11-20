module.exports = (Sequelize, sequelize, Country, Data) => {
    return sequelize.define('resorts', {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: Sequelize.STRING,
        id_country: {
            type: Sequelize.INTEGER,
            references: {
                model: Country,
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        },
        id_video: {
            type: Sequelize.INTEGER,
            references: {
                model: Data,
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        }
    });
};