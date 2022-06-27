const fs = require("fs");
//it's return a file is you give this a path, if it didnt found your file it return false boolean value
//you can use in your code for example: 
//const read = require("./read_File");
//you can to call it:
//read(`${__dirname}/source/index.html`); 
function read_File(path){
    try{ 
        return fs.readFileSync(path);
    }catch{
        return false;
    }
}
module.exports = read_File;