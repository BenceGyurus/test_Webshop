const express = require("express");
const app = express(); 
const fs = require("fs");
//const selector = require("./selector");
const bodyParser = require('body-parser');


function open_File(path){
    try{
        return fs.readFileSync(`${__dirname}/${path}`, "utf-8");
    }catch{
        return false;
    }
}

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
        let list = JSON.parse(open_File("headers.json")).headers;
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

function parse_Body(data){
    key = Object.keys(data);
    if (key.length == 1 && !data[key]){
        data = key[0];
    }
    return JSON.parse(data)
}

app.use(bodyParser.urlencoded({extended: false}))

app.post("/adminlogin",(req, res) =>{
    file_Data = open_File("admin.json");
    if (file_Data){
        json_File = JSON.parse(file_Data);
        let body = parse_Body(req.body)
        console.log(body.mail);
    }
    else{
        res.send(JSON.stringify({message: "error"}));
    }
    
});


app.post('/post-test', (req, res) => {
    console.log('Got body:', req.body);
    //sendStatus(200);
    res.send("ok");
});

app.get("/", (req, res)=>{
    res.sendFile(`${__dirname}/source/index.html`);
});


app.get("/admin-login", (req, res)=>{
    res.sendFile(`${__dirname}/source/admin-login/login.html`);
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

app.use((req, res, next) =>{
    console.log(req.url);
    if(req.url.split(".").length > 1 && req.method == "GET"){
        res.set('Content-Type', set_Header.get_Header(req.url));
        res.send(open(`${__dirname}/source/${req.url}`));
    }
    else{
        let json_Datas = JSON.parse(open_File("path.json"));
        if (json_Datas[req.url]){
            res.send(open(`${__dirname}/source/${json_Datas[req.url]}`));
        }
    }
    next();
})

app.get("/", (req, res)=>{
    res.sendFile(`${__dirname}/source/index.html`);
})


app.listen(server_Settings()[1])

