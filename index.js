const express = require("express");
const app = express(); 
const fs = require("fs");
//const selector = require("./selector");
const bodyParser = require('body-parser');
const encryption = require("./encryption.js");

var tokens = {};
var long_Tokens = {};

class logined_Users{
    static request(){
        let json_Datas = open(`${__dirname}/users/logined_Users.json`);
        let datas = json_Datas ? JSON.parse(json_Datas) : false;
        return datas;
    }
    static add(key , datas){
        data = this.request()
        let json =  Object.keys(data).length ? data : {};
        json[key] = datas;
        //return json;
        this.write(json);
    }
    static delete(key){
        let json = this.request(); 
        let keys = Object.keys(json);
        for (let i = 0; i < keys; i++){
            if (keys[i] == keys){
                delete json[keys[i]];
            }
        }
        this.write(json);
    }
    static write(data){
        fs.writeFileSync( `${__dirname}/users/logined_Users.json`, JSON.stringify(data));
    }
}

function control_Long_Token(token, ip_Adress){
    let long_Tokens = logined_Users.request();
    if (Object.keys(long_Tokens).length > 0){
    if (long_Tokens[token] && long_Tokens[token].ip == ip_Adress){return true}else{return false}
    }
    else{
        return false;
    }
}

class user_Informations{
    static open(token){
        tokens = logined_Users.request()[token];
        return tokens;
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

class search{
    static in_Users(username, key){
        let users = JSON.parse(open(`${__dirname}/admin_Datas/admin.json`));
        if (users[username]){
            return users[username][key];
        }
    }
    static in_Rules(rule){
        let rules = JSON.parse(open(`${__dirname}/admin_Datas/rules.json`));
        return rules[rule];
    }
}


function get_Ip(req){
    if (req.headers['x-forwarded-for']){
        return req.headers['x-forwarded-for'];
    }
    else{
        return req.socket.remoteAddress;
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
    file ? res.sendFile(`${__dirname}/source/${file_Name}`) : res.status(404).sendFile(`${__dirname}/source/404.html`);
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
        message = "";
        if (json_File[body.mail]){
            //res.send(encryption(body.password));
            if ((json_File[body.mail].password) == encryption(body.password)){
                token = generate_Token(100);
                message = {message: "Sikeres bejelentkezés", response: true, token: token};
                tokens[token] = {ip: req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for']: req.socket.remoteAddress, user: body.mail,user_Id: json_File[body.mail].id};
            }
            else{
                message = {message: "Helytelen jelszó"};
            }
        }
        else{
            message = {message: "Helytelen felhasználónév"};
        }
        
    }
    else{
        message = {message: "error"};
    }

    res.send(message);
    
});


app.post("/get_Ip", (req, res)=>{
    res.send({
        "req.headers['x-forwarded-for']" : req.headers['x-forwarded-for'],
        "req.socket.remoteAddress" : req.socket.remoteAddress
    })
})

function control_Admin(access, token){
    user = user_Informations(token);
    all_User_Data = search.in_Users(user);
    if (all_User_Data){
        return all_User_Data.edit_Rule[access] ? true : false;
    }
    else{
        return false;
    }
}


app.post("/get_Products", (req,res)=>{
    body = parse_Body(req.body);
    if (control_Long_Token(body.token, get_Ip(req))){
        control_Admin ? res.sendFile(`${__dirname}/source/products.json`) : res.send(JSON.stringify({error: true, message: "Nincs hozzáférése ehhez a fájlhoz"}));
    }
})

app.post("/get_Admin_Rule", (req,res)=>{
    let body = parse_Body(req.body);
    //long_Tokens = logined_Users.request();
    if (body.token){
    if (control_Long_Token(body.token,get_Ip(req))){
        user = user_Informations.open(body.token);
        edit_Rules = search.in_Users(user.user, "edit_Rule");
        list_Rules = Object.keys(edit_Rules);
        json = {data : [], user_Name: user.user};
        for (let i = 0; i < list_Rules.length;i++){
            all_Data = edit_Rules[list_Rules[i]] ? json.data.push(search.in_Rules(list_Rules[i])) : "";
            
        }
        //open(`${__dirname}/admin_Datas/rules.json`) ? res.sendFile(`${__dirname}/admin_Datas/admin_Rules.html`) : res.sendFile(`${__dirname}/source/404.html`)
        res.send(JSON.stringify(json));
    }
    else{
        res.send({message: "Nincs hozzáférése ehhez az oldalhoz!", error: true});
    }
    }
    else{
        res.send({message: "Nincs hozzáférése ehhez az oldalhoz!", error: true});
    }
})

function control_Access(token, ip){
    file_Datas = open(`${__dirname}/users/logined_Users.json`);
    json_Data = file_Datas ? JSON.parse(file_Datas) : false;
    if (json_Data){
        if (json_Data[token]){
            if (json_Data[token].ip == ip){return [json_Data[token].user_Id, json_Data[token].user];}
            else{return false;}
        }
        else{return false;}
    }
    else{return false;}
}

//https://stackoverflow.com/questions/23187013/is-there-a-better-way-to-sanitize-input-with-javascript
function sanitizeString(str){
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
}

function create_Id(string){
    let new_String = "";
    chars = JSON.parse(open(`${__dirname}/chars.json`));
    for (let i = 0; i < string.length; i++){
        if (chars[string[i]]){
            new_String += chars[string[i]].toLowerCase();
        }
        else{
            new_String += string[i].toLowerCase();
        }
    }
    return new_String
}

function edit_Products(datas){
    products = [];
    for (let i = 0; i < datas.length; i++){
        keys = Object.keys(datas[i]);
        product = {};
        for (let j = 0;j < keys.length; j++){
            typeof(product[keys[j]]) == "string" ?product[keys[j]] = sanitizeString(datas[i][keys[j]]) : product[keys[j]] = datas[i][keys[j]];
        }
        product.rating = 0;
        product.image = "test_Image.png"; 
        product.id = create_Id(product.name);
        products.push(product);
    }
    return products;
}

app.post("/edit_Products", (req,res)=>{
    let body = parse_Body(req.body);
    let user_Id = control_Access(body.token, get_Ip(req));
    let sent = false;
    let error = "";
    if (user_Id){
        let accesses = search.in_Users(user_Id[1], "edit_Rule");
        if (accesses){
            if (accesses.add_Product){
                sent = true;
                try{
                datas = JSON.parse(open(`${__dirname}/source/products.json`)); 
                datas.products = edit_Products(body.products);
                fs.writeFile(`${__dirname}/source/products.json`, JSON.stringify(datas), (err) => {
                    if (err)
                        res.send(JSON.stringify({error: false, message: "Sikertelen mentés"}));
                    else {
                        res.send(JSON.stringify({error: false, message: "Sikeres mentés"}));
                    }
                  });
                }
                catch{
                    error = "Helytelen adat";
                }
                
            }else{
                error = "Nincs hozzáférése az oldalhoz";
            }
        }
        else{
            error = "Nincs hozzáférése az oldalhoz";
        }
    }
    else{
        error = "Az felhasználója jelenleg nem működik";
    }
    sent ? "":res.send(JSON.stringify({error: true, message: error}));
    }
)


function create_File_Name(){
    date = new Date();
    return `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}`
}

app.post("/make_Backup", (req, res)=> {
    let body = parse_Body(req.body);
    let user_Id = control_Access(body.token, get_Ip(req));
    if (user_Id){
        let accesses = search.in_Users(user_Id[1], "edit_Rule");
        if (accesses){
            let file_Name = create_File_Name();
            file_Data = open(`${__dirname}/source/products.json`);
            fs.writeFile(`${__dirname}/backups/${file_Name}.json`, file_Data, (err)=>{
                err ? res.send(JSON.stringify({error:true, message:"Sikertelen biztonsági mentés"})) : res.send(JSON.stringify({error: false, message: "Sikeres biztonsági mentés"}));
            })
        }
    }
});

app.post("/add_Products", (req, res)=> {
    let body = parse_Body(req.body);
    let user_Id = control_Access(body.token, get_Ip(req));
    let error = "" 
    if (user_Id){
        let accesses = search.in_Users(user_Id[1], "edit_Rule");
        if (accesses){
            if (accesses.add_Product){
                res.sendFile(`${__dirname}/source/add_Products/index.html`);
            }else{
                error = "Nincs hozzáférése az oldalhoz";
            }
        }
        else{
            error = "Nincs hozzáférése az oldalhoz";
        }
    }
    else{
        error = "Az felhasználója jelenleg nem működik";
    }
    error ? res.send(JSON.stringify({error: true, message: error})) : "";
})

app.post("/admin-login-cookie", (req,res)=>{
    let body = parse_Body(req.body);
    if (tokens[body.token].ip == get_Ip(req)){
        let long_Token = generate_Token(100); 
        logined_Users.add(long_Token, {ip: get_Ip(req), user: tokens[body.token].user, user_Id: tokens[body.token].user_Id});
        res.send(JSON.stringify({name: "login_Token", value: long_Token}));
        delete tokens[body.token];
    }
});




app.get("/products/:id", (req, res)=>{
    let is_There = false;
    products = JSON.parse(open(`${__dirname}/source/products.json`));
    for (let i = 0; i < products.products.length; i++){
        if (products.products[i].id == req.params.id){
            is_There = true;
        }
    }
    if (is_There){
        res.send(open(`${__dirname}/source//products/index.html`));
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

