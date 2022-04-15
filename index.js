const express = require("express");
const app = express(); 
const fs = require("fs");
//const selector = require("./selector");
const bodyParser = require('body-parser');
const encryption = require("./encryption.js");

var tokens = {};



function open(path){
    try{
        return fs.readFileSync(`${path}`, "utf-8");
    }catch{
        return false;
    }
}

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

class set_Header{
    static get_Header(file_Name){
        let name = file_Name.split("/")[file_Name.split("/").length-1];
        this.extension = name.split(".")[name.split(".").length-1];
        this.get_Type();
        return this.build();
    }

    static get_Type(){
        let list = JSON.parse(open(`${__dirname}/headers.json`)).headers;
        this.type = "text";
        for (let i = 0; i < list.length; i++){
            for (let j = 0; j < list[i][0].length; j++){
                if (this.extension == list[i][0][j]){
                    this.type = list[i][1];
                }
            }
        }
        return this.type;
    }

    static build(){
        return `${this.type}/${this.extension}`;
    }
}


function open_Error(){
    return open(`${__dirname}/source/404.html`);
}

function send(res, data, status){
    if (status) data ? res.stauts(200) : res.stauts(404);
    if (!data){
        data = open_Error();
    }
    res.send(data);
}

function send_File(res, file_Name, status){
    let file = open(`${__dirname}/source/${file_Name}`);
    file ? res.status(200).sendFile(`${__dirname}/source/${file_Name}`) : res.status(404).sendFile(`${__dirname}/source/404.html`);
}

function generate_Token(length){
    let letters_And_Numbers = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7' ,'8', '9', '0'];
    let token = "";
    for (let i = 0; i < length; i++){
        token += letters_And_Numbers[Math.ceil(Math.random()*letters_And_Numbers.length)];
    }
    return token;
}

function parse_Body(data){
    key = Object.keys(data);
    if (key.length == 1 && !data[key]){
        data = key[0];
    }
    return JSON.parse(data)
}
//app.use(express.static('source'));
app.use(bodyParser.urlencoded({extended: false}))

app.post("/adminlogin",(req, res) =>{
    file_Data = open(`${__dirname}/admin_Datas/admin.json`);
    if (file_Data){
        json_File = JSON.parse(file_Data);
        let body = parse_Body(req.body);
        res.send(body);
        /*if (json_File[body.mail]){
            if ((json_File[body.mail].password) == encryption(body.password)){
                token = generate_Token(100);
                res.send({message: "Sikeres bejelentkezés", response: true, token: token});
                //tokens[token] = req.socket.remoteAddress;
            }
            else{
                res.send({message: "Helytelen jelszó"});
            }
        }
        else{
            res.send({message: "Helytelen felhasználónév"});
        }*/
    }
    else{
        res.send({message: "error"});
    }
    
});

app.post("/admin-login-cookie", (req,res)=>{
    let body = parse_Body(req.body);
    if (tokens[body.token]){
        let long_Token = generate_Token(100);
        res.send(JSON.stringify({name: "login_Token", value: long_Token}));
        delete tokens[body.token];
    }
});


app.post('/post-test', (req, res) => {
    console.log('Got body:', req.body);
    //sendStatus(200);
    res.send("ok");
});

app.get("/products/:id", (req, res)=>{
    let is_There = false;
    products = JSON.parse(open_File("source/products.json"));
    for (let i = 0; i < products.products.length; i++){
        console.log(products.products[i].id);
        if (products.products[i].id == req.params.id){
            is_There = true;
        }
    }
    if (is_There){
        res.send(open_File("source/products/index.html"));
    }
    else{
        res.send("error");
    }
})

app.get("/", (req, res)=>{
    res.sendFile(`${__dirname}/source/index.html`);
});

app.get("/admin-login", (req, res)=>{
    res.sendFile(`${__dirname}/source/admin-login/login.html`);
});

app.use((req,res)=>{
    if (req.url.split(".").length > 1 && req.method == "GET"){
        //let file = open(`${__dirname}/source/${req.url}`);
        send_File(res,req.url);
    }
    else{
        let paths = JSON.parse(open(`${__dirname}/path.json`));
        paths[req.url] ? res.sendFile(`${__dirname}/source/${paths[req.url]}`) : res.status(404).sendFile(`${__dirname}/source/404.html`) ;
    }
})


app.listen(server_Settings()[1])

