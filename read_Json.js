const read = require("./read_File.js");

function read_Json(file_Name){
    file_Data = read(`${__dirname}/${file_Name}`);
    try{return JSON.parse(file_Data)}catch{return false}
}
module.exports = read_Json;