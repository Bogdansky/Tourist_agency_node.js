const writeFile = require('fs').writeFile;
const exist = require('fs').existsSync;

module.exports.createFile = (name, data) => {
    if (exist(name)){
        return "Файл уже существует"
    }
    else{
        writeFile(name, data, (err) => {
            if (err){
                return err.message;
            }
            return "удачно";
        });
    }
}