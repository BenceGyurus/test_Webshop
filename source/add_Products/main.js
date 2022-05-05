all_List = [];
edit_List = ["name", "price", "description", "stock"];
radio = ["isInStock"]
radio_Type = [["isInStock", bool]];
selection = ["select"]
edit = [["name", "Termék neve", String], ["price", "Termék ára", Number], ["description", "Termék leírása", String], ["stock", "Készlet (db)", Number]];
function bool(string){
    return string == "true" ? true : false;
}
function create(){
    edit = window.edit
    div_Id = random_Id();
    inputs = "";
    inputs_Ids = {}
    inputs += html.img("", "delete_Button", "/delete.png", `delete_This('${div_Id}')`);
    for (let i = 0; i < edit.length; i++){
        input_Id = random_Id();
        inputs_Ids[edit[i][0]] = input_Id;label = html.label("", "title_Of_Line", edit[i][1]);input = html.input(input_Id, "input", "text", "", "", "");
        inputs += html.div("", "grid_Div", `${label}${input}`);
    }
    let radio_Buttons = "";
    let radio_Div_Id = random_Id();
    is_In_Stock_Array = [["Raktáron", true], ["Nincs raktáron", false]];
    inputs += html.label("", "is_In_Stock", "Raktáron:");
    radio_Ids = [];
    for (let j = 0; j < window.radio.length;j++){
        radio_Name = random_Id();
        inputs_Ids[window.radio[j]] = radio_Name;
        for (let i = 0; i < is_In_Stock_Array.length; i++){
            radio_Ids.push(random_Id());
            this_Button = html.label("", `in_Stock_${is_In_Stock_Array[i][1]}`, is_In_Stock_Array[i][0], radio_Ids[radio_Ids.length-1]);
            this_Button += html.input(radio_Ids[radio_Ids.length-1],"in_Stock", "radio", "", is_In_Stock_Array[i][1], radio_Name, "");
            radio_Buttons += html.div("", "in_Stock_Div", this_Button);    
        }
}
    inputs += html.div(radio_Div_Id, "radio_Div", radio_Buttons)
    window.all_List.push(div_Id);
    window.datas[div_Id] = inputs_Ids;
    document.getElementById("edit_Panel").innerHTML += html.div(div_Id, "main_Div", inputs);
    return div_Id;
}

function create_New(){
    let d = save_Datas();
    create();
    re_Save_Datas(d);
}

function delete_This(id){
    for (let i = 0; i < window.all_List.length; i++){
        if (window.all_List[i] == id){
            delete window.all_List[i];
            break;
        }
    }
    document.getElementById(id).remove();
}

function element_Products(products){
    products = JSON.parse(products);
    d = false;
    for (let i = 0; i < products.products.length; i++){
        div_Id = create();
    }
    for (let i = 0; i < products.products.length; i++){
        for (let j = 0; j < window.edit_List.length; j++){
            
            products.products[i][window.edit_List[j]]?insert(window.datas[window.all_List[i]][window.edit_List[j]],products.products[i][window.edit_List[j]]): "";
        }
        for (let j = 0; j < window.radio.length; j++){
            //window.datas[window.all_List[i]][window.radio[j]];
            element = document.getElementsByName(window.datas[window.all_List[i]][window.radio[j]]);
            for (let k = 0; k < element.length; k++){
                if (element[k].value == String(products.products[i][window.radio[j]])){
                    element[k].checked = true;
                }
            }
        }
    }
}
function main(){
    query("/get_Products", element_Products);
}

function save(){
    let to_Send = get_Data();
    send_Datas(to_Send);
    write_Alert("Sikeresen mentettük változtatásait", "suc", "Sikeres mentés");
}

function send_Datas(products){
    send("POST", "edit_Products", JSON.stringify({
        token: parse_Cookies().login_Token,
        products: products
    }))
}

function get_Data(){
    let array = [];
    for (let i = 0; i < window.all_List.length; i++){
        dict = {};
        if (window.all_List[i]){
        for (let j = 0; j < window.edit_List.length; j++){
            try{
            dict[window.edit_List[j]] = window.edit[j][2](get_Value(window.datas[window.all_List[i]][window.edit_List[j]]));
            }catch{
            dict[window.edit_List[j]] = false;
            }
        }
        for (let j = 0; j < window.radio.length; j++){
            try{
                window.radio_Type[j][1](document.querySelector(`input[name="${window.datas[window.all_List[i]][window.radio[j]]}"]:checked`).value) ?"" : dict["stock"] = 0; 
                dict[window.radio[j]] = window.radio_Type[j][1](document.querySelector(`input[name="${window.datas[window.all_List[i]][window.radio[j]]}"]:checked`).value);
            }
            catch{
                dict[window.radio[j]] = false;
            }
        }
        array.push(dict);
    }
    }
    return array;
}

function download_This(file_Data){
    date = new Date().toString();
    var a = document.createElement("a"),
                url = URL.createObjectURL(file_Data);
        a.href = url;
        a.download = `biztonsagi_Mentes_${date}.json`;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    /*let a = document.getElementById("download");
    let file = new Blob(file_Data, {type: "json"});
    a.href = URL.createObjectURL(file);
    a.download = `biztonsagi_Mentes_${date}.json`;
*/
    //window.navigator.msSaveOrOpenBlob(file_Data, `biztonsagi_Mentes_${date}.json`);
}


function add_Selection(){
    div_Id = random_Id();

}

function open_Settings(){
    
}

window.onload = main();