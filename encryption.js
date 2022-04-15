const fs = require("fs");
function encryption(string){
    //string = convert(string);
    let list = string.split('');
    let new_String = "";
    for (let i  = 0; i < list.length; i++){
        let x = list[i].charCodeAt(0);
        new_String += Math.floor(Math.sin(x**(-1*Math.E))*123456789123456789123);
    }
    return new_String;
}

function convert(string){
    try{
        let error = false;
        let new_String = "";
        let data = JSON.parse(fs.readFileSync("encryption.json"));
        for (let i = 0; i < string.length; i++){
            if (data[string[i]]){
                new_String += data[string[i]]; 
            }
            else{
                error = true;
                return false;
            }
        }
        return new_String;
    } 
    catch{
        return false;
    }
}

module.exports = encryption;
