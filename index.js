const express = require("express");
const app = express(); 
const bodyParser = require('body-parser');
const server_Settings = require("./server_Settings/server_Setting.js");
const send = require("./send_Datas.js");
const response = require("./select_File.js");
const functions = require("./functions.js");
const login = require("./login.js");
const access = require("./control_Access.js");
//select file

app.use(bodyParser.urlencoded({extended: true}));
app.post("/adminlogin", (req,res)=>{
    send(res, login.control_User(functions.parseBody(req.body), req));
})
app.post("/admin-login-cookie", (req,res)=>{
    send(res,login.control_Token(req,res));
})
app.post("/get_Admin_Rule", (req,res)=>{
    console.log(access.get_Access(req));
    send(res, access.get_Access(req));
})
app.use((req, res)=>{
    req.method == "GET" ? send(res, "", response(req)) : console.log("POST: ", req.url);
});


app.listen(server_Settings()[1])

