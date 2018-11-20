module.exports = (Sequelize,sequelize, Resort, Manager) => {
    return sequelize.define('tours', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        resort_id: {
            type: Sequelize.INTEGER,
            references:{
                model: Resort,
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        },
        id_manager: {
            type: Sequelize.INTEGER,
            references:{
                model: Manager,
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        }
    })
}