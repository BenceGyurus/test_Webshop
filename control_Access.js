const login = require("./login.js");
const functions = require("./functions.js");
class access{
    static get_Access(req){
        return {user_Name: login.control_Long_Token(req).user.id, data: login.control_Long_Token(req).user.edit_Rule};
    }
    static control_Access(req, access){
        return login.control_Long_Token(req).edit_Rule[access] ? true : false;
    }
}

module.exports = access;