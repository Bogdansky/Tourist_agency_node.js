module.exports = (Sequelize,sequelize, Client, Tour, Abode) => {
    return sequelize.define('orders', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_client: {
            type: Sequelize.INTEGER,
            references: {
                model: Client,
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        },
        id_tour: {
            type: Sequelize.INTEGER,
            references: {
                model: Tour,
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        },
        id_abode: {
            type: Sequelize.INTEGER,
            references: {
                model: Abode,
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        },
        cost: Sequelize.DOUBLE,
        date_of_sale: Sequelize.DATE,
        date_of_start: Sequelize.DATE
    })
}