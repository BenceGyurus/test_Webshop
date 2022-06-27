const fs = require("fs");
class functions{
    static parseBody(json){
        try{return JSON.parse(Object.keys(json)[0])}catch{return JSON.parse(json)}
    }
    static generate_Token(length){
        let letters_And_Numbers = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7' ,'8', '9', '0'];
        let token = "";
        for (let i = 0; i < length; i++){
            token += letters_And_Numbers[Math.ceil(Math.random()*letters_And_Numbers.length)];
        }
        return token;
    }
    static get_Ip(req){
        return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    }
    static read_Json(file_Name){
        let file_Data = fs.readFileSync(`${__dirname}/${file_Name}`);
        return file_Data ? JSON.parse(file_Data) : false;
    }
    static write_Json(file_Name, data){
        console.log(JSON.stringify(data));
        fs.writeFileSync(`${__dirname}/${file_Name}`, JSON.stringify(data));
    }
    static append_Json(file_Name, data){
        let datas = this.read_Json(file_Name);
        for (let i = 0; i < Object.keys(data).length; i++){
            datas[Object.keys(data)[i]] = data[Object.keys(data)[i]];
        }
        this.write_Json(file_Name,datas);
    }
}

module.exports = functions;