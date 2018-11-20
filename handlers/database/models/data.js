module.exports = (Sequelize, sequelize) => {
    return sequelize.define('data', {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        data: Sequelize.BLOB,
        docguid: Sequelize.UUID,
        name: Sequelize.STRING,
        type: { // 'text','audio','video','picture','file'
            type: Sequelize.STRING,
            defaultValue: 'file'
        }
    });
};  