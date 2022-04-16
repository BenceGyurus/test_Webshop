
function logout(){
    cookie.delete_Cookie("login_Token");
    window.location = "/admin-login"
}

function request(){

}


function element_To_Body(data){
    document.body.innerHTML += data;
}

function ajax(method, url, data, callBack){
    req = new XMLHttpRequest();
    /*req.onreadystatechange = ()=>{
        if (req.readyState == 4 && req.status == 200){
            if (callBack){callBack(req.responseText)};
        }
        else if (req.readyState == 4 && req.status == 404){
            write_Alert("Ilyen fájl nem található a szerveren", "", "Hiba");
        }
    }*/
    req.onload = ()=>{
        if (req.status == 200){
            try{
                JSON.parse(req.responseText).error ? JSON.parse(req.responseText).message ? write_Alert(JSON.parse(req.responseText).message): write_Alert("Hiba lépett fel az oldal betöltése közben", "", "Hiba") :"";
            }
            catch{
                if (callBack){callBack(req.responseText)};
            }
        }
        else{
            /*write_Alert("Hiba lépett fel az oldal betöltése közben", "", "Hiba");*/    
        }
    }
    req.open(method, url);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(data);
}

function get_Admin_Rule(){
    console.log(parse_Cookies());
    if (parse_Cookies().login_Token){
        ajax("POST", "/get_Admin_Rule", JSON.stringify({token:parse_Cookies().login_Token}), element_To_Body);
        setTimeout(()=>{
            write_Alert("Soha ne adja meg senkinek a jelszavát!", "warning");
        }, 10000);
    }
    else{
       window.location = "/admin-login";
    }
}

window.onload = get_Admin_Rule;