const read = require("./read_Json.js");
const encryption = require("./encryption.js");
const functions = require("./functions.js");
class login{
    static logined_Users = {};
    static short_Users = {};
    static users = read("admin_Datas/admin.json");
    static write_Token(){

    }
    static control_Long_Token(req){
        return functions.read_Json("users/logined_Users.json")[functions.parseBody(req.body).token] ? functions.read_Json("users/logined_Users.json")[functions.parseBody(req.body).token] : false;
    }
    static control_Token(req,res){
        let long_Token = functions.generate_Token(100);
        let json_File = {}
        json_File[long_Token] = {}
        if (this.short_Users[functions.parseBody(req.body).token].ip === functions.get_Ip(req)){
            json_File[long_Token] = this.short_Users[functions.parseBody(req.body).token];
            console.log(json_File);
            functions.append_Json("users/logined_Users.json", json_File);
            return {name: "login_Token", value: long_Token};
        }
        else{return {error: true};}             
    }
    static control_User(json,req){
        let password = encryption(json.password);
        let control = this.users[json.mail] ? this.users[json.mail].password == password ? true : false : false;
        let token = functions.generate_Token(50);
        control ? this.short_Users[token] = {user: this.users[json.mail], ip: functions.get_Ip(req)}: "";
        return control ? JSON.stringify({error: false, token: token, response: true}) : {error: true, error_Code: "01", response: false};
    }
}

module.exports = login;