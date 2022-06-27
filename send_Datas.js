const read = require("./read_File.js");
//it return the header of extension of url
function get_Header(url){
    let unReadExtensions = read("headers.json"); 
    extensions = unReadExtensions ? JSON.parse(read("headers.json"))["headers"] : false;
    if (extensions){
        let extension = false;let file_Name = url ?  url.split("/")[url.split("/").length-1] : false;
        if (file_Name.split(".").length > 1 ){extension = file_Name.split(".")[file_Name.split(".").length-1]}
        for (let i = 0; i < extensions.length; i++){
            for (let k = 0; k < extensions[i][0].length; k++){
                if (extension == extensions[i][0][k]){
                    return `${extensions[i][1]}/${extensions[i][0][k]}`;
                }
            }
        }
    }
    else{return false};
}
//it send data or file with     res      argument
function send(res, data, file_Name){
    let file_Data = data ? data : "";
    !file_Data&&file_Name ?  file_Data = read(`${__dirname}/source/${file_Name}`) : "";
    if (file_Name){
        res.set("Content-type", get_Header(file_Name));
    }
    res.status(200).send(file_Data);
}

module.exports = send;