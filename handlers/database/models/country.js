module.exports = (Sequelize,sequelize) => {
return sequelize.define('countries', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING,
    visa_regime: Sequelize.STRING
})
}