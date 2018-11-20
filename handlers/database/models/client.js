module.exports = (Sequelize,sequelize) => {
    return sequelize.define('clients', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        login: Sequelize.STRING,
        password: Sequelize.BLOB
    })
}