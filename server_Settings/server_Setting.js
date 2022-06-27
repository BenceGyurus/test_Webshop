const fs = require("fs");

function server_Settings(){
    let host_Name = "0.0.0.0";
    let port = 3000;
    try{
        data = JSON.parse(fs.readFileSync(`${__dirname}/server_Data.json`));
        host_Name = data.host;
        port = data.port; 
    }
    catch{

    }
    return [host_Name, port];
}

module.exports = server_Settings;