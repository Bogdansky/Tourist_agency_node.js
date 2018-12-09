const writeFile = require('fs').writeFile;
const exist = require('fs').existsSync;
const db = require('../handlers/database/db');

module.exports.createFile = async (id,name, type) => {
    let result = await db.getFile(id);
    let newname = name+result.name;
    if (!exist(newname)){
        writeFile(name+result.name, result.data, (err) => {
            if (err){
                return err.message;
            }
            return `${type}/`+result.name;
        });
    }
    return `${type}/`+result.name;
}

