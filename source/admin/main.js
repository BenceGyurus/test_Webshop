
function logout(){
    cookie.delete_Cookie("login_Token");
    window.location = "/admin-login"
}

function request(){

}

function load(data){
    datas = JSON.parse(data);
    document.getElementById("userName").innerHTML += datas.user_Name;
    element_Rules(datas.data);
}

function element_To_Body(data){
    document.body.innerHTML += data;
}

function element_To_Edit(data){
    document.getElementById("edit").innerHTML = data;
}

function html_Ajax(method, url, data, callBack){
    req = new XMLHttpRequest();
    console.log(callBack);
    req.onload = ()=>{
        if (req.status == 200){
            try{
                json_Data = JSON.parse(req.responseText);
                if (json_Data.error && json_Data.message){
                    write_Alert(json_Data.message, "", "Hiba");
                }
                else if(json_Data.error && !json_Data.message){
                    write_Alert("Hiba lépett fel az oldal betöltése közben", "", "Hiba");
                }
            }
            catch{
                callBack(req.responseText);
            }
        }
    }
    req.open(method, url);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(data);
}

function ajax(method, url, data, callBack){
    req = new XMLHttpRequest();
    console.log(callBack);
    req.onload = ()=>{
        if (req.status == 200){
            try{
                JSON.parse(req.responseText).error ? JSON.parse(req.responseText).message ? write_Alert(JSON.parse(req.responseText).message): write_Alert("Hiba lépett fel az oldal betöltése közben", "", "Hiba") : callBack(req.responseText);
            }
            catch{
                write_Alert("Hiba lépett fel az oldal betöltése közben", "", "Hiba");
            }
        }
    }
    req.open(method, url);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(data);
}

function get_Admin_Rule(){
    console.log(parse_Cookies());
    if (parse_Cookies().login_Token){
        ajax("POST", "/get_Admin_Rule", JSON.stringify({token:parse_Cookies().login_Token}), load);
        setTimeout(()=>{
            write_Alert("Soha ne adja meg senkinek a jelszavát!", "warning");
        }, 10000);
    }
    else{
       window.location = "/admin-login";
    }
}

function get_This(url){
    window.location = url;
    //html_Ajax("POST", url, JSON.stringify({token : parse_Cookies().login_Token}), element_To_Edit);
}

function element_Rules(list){
    for (let i = 0; i < list.length; i++){
        document.getElementById("conteiner").innerHTML += `<input class = "select_Button" type = "button" onclick = "get_This('${list[i][0]}')" value = "${list[i][1]}">`
    }
}

window.onload = get_Admin_Rule;