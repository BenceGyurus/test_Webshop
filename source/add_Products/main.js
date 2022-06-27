all_List = [];  //Az összes termék hozzáadáshoz tartozó div ID-ja
edit_List = ["name", "price", "description", "stock"];  //Ezek a datas objektum kulcsai minden all_List elemhez, amihez inputtal kerjük be az adatot
radio = ["isInStock"]   //radio gombbal bekert adat kulcsa
radio_Type = [["isInStock",bool]]; //radio gombbal bekert adat kulcsa és típusa
selection = ["select"];
select_Ids = [];
select_Datas = {};
products =  {};
var div_Id = "edit_Div";
edit = [["name", "Termék neve", String], ["price", "Termék ára", Number], ["description", "Termék leírása", String], ["stock", "Készlet (db)", Number]];
function bool(string){
    return string == "true" ? true : false;
}


function delete_This(id){
    if (id){
        send_With_Datas("/delete_Product", {id:id}, saved_Products);
    }
    else{
        close_Edit();
    }
    close_Edit();
    unselect();
}

function close_Edit(){
    window.datas = {};
    document.getElementById("edit_Panel").innerHTML = "";
}

function unselect(){
    for (let i = 0; i < Object.keys(window.products).length; i++){
        document.getElementById(window.products[Object.keys(window.products)[i]][1]).style.background = "white";
    }
}

function edit_This_Product(product_Id){
    create(window.products[product_Id][0]);
    document.getElementById(window.products[product_Id][1]).style.background = "#14c4f5";
}


function load_This_Product(product){
    this_Datas = "";
        div_Id = random_Id();
        for (let k = 0; k < window.edit.length; k++){
            this_Datas += html.label("", "loaded_Item", `${window.edit[k][1]} : ${product[window.edit[k][0]]}`);
        }
        for (let k = 0; k < window.radio.length; k++){
            this_Datas += html.label("", `${product[window.radio[k]] ? "there_Is" : "empty"}`, `${product[window.radio[k]] ? "Raktáron" : "Nincs raktáron"}`, "")
        }
        window.products[product.id] = [product, div_Id];
        all_Datas = html.div("", "datas_Grid", this_Datas)
        all_Datas += html.img("", "edit", "/edit.png", `edit_This_Product('${product.id}')`)
        return html.div(div_Id, "gird_Div", all_Datas);
}

function saved_Products(json){
    data = JSON.parse(json);
    data.error ? console.log("Sikertelen mentés") : console.log("Sikeres mentés");
    load_Products(json);
    close_Edit();
}

function load_Products(products){
    //window.products = JSON.parse(products);
    products = JSON.parse(products).products;
    let html_Datas = "";
    window.products = {};
    document.getElementById("products").innerHTML = "";
    for (let i = 0; i < products.length; i++){
        html_Datas += load_This_Product(products[i]);
    }
    document.getElementById("products").innerHTML += html_Datas;
}

function get_Datas(){
    json = {};
    for (let i = 0; i < window.edit.length; i++){
        /*console.log(window.edit[i][0]);
        console.log(window.datas);*/
        json[window.edit[i][0]] = get_Value(window.datas[window.div_Id][window.edit[i][0]]);
    }
    //console.log(window.datas[window.div_Id][window.radio[0]]);
    for (let i = 0; i < window.radio.length; i++){
        let element = document.getElementsByName(window.datas[window.div_Id][window.radio[i]]);
        for (let k = 0; k < element.length; k++){
            element[k].checked ? json[window.radio[i]] = window.radio_Type[i][1](element[k].value) : "";
        }
    }
    return json
}

function send_With_Datas(url,datas,callback){
    let req = new XMLHttpRequest();
    req.onreadystatechange = ()=>{
        if (req.status == 200 && req.readyState == 4){
            callback ? callback(req.responseText) : "";
        }
    }
    req.open("POST", url);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(JSON.stringify({token: parse_Cookies().login_Token, datas: datas}));
}

function accept(id){
    let to_Send_Datas = get_Datas();
    if (id){
        control_Product_Datas(to_Send_Datas) ? send_With_Datas("/edit_Product", {id: id, data: to_Send_Datas}, saved_Products) : console.log("Üres");
    }
    else if (!id){
        control_Product_Datas(to_Send_Datas) ? send_With_Datas("/new_Product",  {data: to_Send_Datas}, saved_Products) : "";
    }
}

//létrehozza az adat beviteléhez szükeséges divet
function create(product){
    unselect();
    let div_Id = window.div_Id;
    let html_Datas = "";
    //let images = [["/add.png", "add"], ["/delete.png", "delete"], ["/accept", "accept"]]; //src, class
    d = {};
    for (let i = 0; i < window.edit.length; i++){
        input_Id = random_Id();
        d[window.edit[i][0]] = input_Id;
        html_Datas += html.label("" , "title_Of_Line", `${window.edit[i][1]}:`, input_Id);
        html_Datas += html.input(input_Id, "input", "text", `${window.edit[i][1]}`, `${product ? product[window.edit[i][0]]: ""}`, "", "");
    }
    choose = [[true, "Raktáron"], [false, "Nincs raktáron"]];
    name_Of_Radio_Buttons = random_Id();
    for (let i = 0; i < choose.length; i++){
        radio_Id = random_Id();
        d[window.radio[0]] = name_Of_Radio_Buttons;
        html_Datas += html.label("", "title_Of_Line", choose[i][1], radio_Id);
        html_Datas += html.input(radio_Id, "radio", "radio", "", String(choose[i][0]), name_Of_Radio_Buttons, "");
    }
    all_List.push(div_Id);
    datas[div_Id] = d;
    html_Datas += html.img("", "delete","/delete.png", `delete_This(${product ? `'${product.id}'`: ""})`);
    html_Datas += html.img("", "accept", "/accept.png", `accept(${product ? `'${product.id}'`: ""})`);
    document.getElementById("edit_Panel").innerHTML = html.div(div_Id, "main_Div", html_Datas);
    document.getElementById(div_Id).scrollIntoView();
    for (let i = 0; i < window.radio.length; i++){
        console.log(name_Of_Radio_Buttons);
        element = document.getElementsByName(name_Of_Radio_Buttons);
        for (let k = 0; k < element.length; k++){
            console.log(element[k].value, product[window.radio[i]]);
            element[k].value == String(product[window.radio[i]]) ? element[k].checked = true : "";
        }
    }
}

//hozzáadás
function create_New(){
    create();
}
//Az szervertől kapott termékek beletöltése a szerkesztőbe
function element_Products(products){
    for (let i = 0; i < window.edit_List.length; i++){
        products[window.edit_List[i]] ? insert(datas["edit_Div"][window.edit_List[i]], products[window.edit_List[i]]) :"";
    }
    for (let i = 0; i < window.radio.length; i++){
        element = document.getElementsByName(window.datas["edit_Div"][window.radio[i]]);
        for (let j = 0; j < element.length; j++){
            if (element[j].value == String(products[window.radio[i]])){
                element[j].checked = true;
            }
        }
    }
}

function control_Product_Datas(json){
    let ctrl = true;
    for (let i = 0;i < Object.keys(json).length; i++){
        ctrl = json[Object.keys(json)[i]] == "" ? false : ctrl;
    }
    return ctrl;
}

//az oldal betöltésekor lefutó függvény, amit lekérdezi a termékeket
function main(){
    query("/get_Products", load_Products);
}

function save(){
    send("POST", "/make_Backup", JSON.stringify({token: parse_Cookies().login_Token}, ""))
}


window.onload = main();