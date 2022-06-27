const read = require("./read_File.js") 
/*
    it select the file from the req
*/
function response(req){
    unReadFile = read(`${__dirname}/path.json`);
    let path =unReadFile?JSON.parse(unReadFile):false;
    url = req.url;
    if (url.split(".").length <= 1){
        return path ? path[url] ? path[url] : false : false;
    }
    else{
        return url;
    }
}
module.exports = response;