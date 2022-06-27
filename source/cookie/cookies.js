function cookies(type){
    clear_Cookie_Element()
    !type?cookie.clear_All_Cookie(): "";
    document.cookie = `cookies=${type}`;
}

class cookie{
    static clear_All_Cookie(){
        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    }
    static add_Cookie(name,value){
        cookie.add_Cookie(name, value);
    }
    static delete_Cookie(name){
        cookies = parse_Cookies();
        let list = Object.keys(cookies);
        this.clear_All_Cookie();
        let this_Cookie = "";
        for (let i = 0; i < list.length; i++){
            this_Cookie += `${list[i]}=${cookies[list[i]]};`; 
            if (list[i] == name){
                this_Cookie += "expires=" + new Date().toUTCString() + ";path=/";
            }
            document.cookie = this_Cookie;
            this_Cookie = "";
        }
    }
}

function set_Cookie(url, body){
    req = XMLHttpRequest();
    req.onreadystatechange =()=> {
        if(req.readyState == 4 && req.status == 200){
            data = JSON.parse(req.responseText);
            if (data.name && data.data){
                cookie.add_Cookie(data.name, data.value);
            }
        }
    };
    req.open("GET", `/${url}`);
    req.send(body);
}

function strip(text){
    let new_Text = "";
    let list = text.split(" ");
    for (let i = 0; i < list.length; i++){list[i] ? new_Text += list[i] : ""}
    return new_Text
}

function parse_Cookies(){
    let all_Cookie = document.cookie;
    let cookie_List = all_Cookie.split(";");
    let cookies = {};
    for (let i = 0; i < cookie_List.length; i++){
        cookies[strip(cookie_List[i].split("=")[0])] = "";
        for (let k = 1; k < cookie_List[i].split("=").length; k++){
            cookies[strip(cookie_List[i].split("=")[0])] += cookie_List[i].split("=")[k];
        }
    }
    return cookies;
}

function main(){
    cookies = parse_Cookies();
    if (!cookies.cookie){
        set_Cookie("/cookie/cookie_Ask.html")
    }
}
function element_Body(datas){
    document.body.innerHTML+=datas;
    add_Style();
}

function request(url, come_Back){
    let req = new XMLHttpRequest();
    req.onreadystatechange =()=> {
        if(req.readyState == 4 && req.status == 200){
            console.log(req.responseText);
            if (come_Back){
            come_Back(req.responseText);
            }
        }
    };
    req.open("GET", `/${url}`);
    req.send();
}

function clear_Cookie_Element(){
    document.getElementById("cookie_Conteiner").remove();
}

function ask_Cookies(){
    try{
        clear_Cookie_Element();
    }
    catch{}
        let ask_Datas = [["cookie_Ask.html", element_Body]];//, ["cookie_Ask.css", ""]
        for (let i = 0; i < ask_Datas.length; i++){
            request(`cookie/${ask_Datas[i][0]}`, ask_Datas[i][1]);
        }

}

function add_Style(){
    const width = window.innerWidth;
    const height = window.innerHeight;
    let height_Of_Div = 0.09; //%
    const id = "cookie_Conteiner";
    height_Of_Div = (height*height_Of_Div > 50) ? height_Of_Div : height_Of_Div*2; 
    document.getElementById(id).style.height = `${Math.ceil(height*height_Of_Div)}px`;
    document.getElementById(id).style.width = `${width}px`
    document.getElementById(id).style.top = `${height-Math.ceil(height*height_Of_Div)}px`;
}


function add_Cookie(data){
    console.log(parse_Cookies());
    if (parse_Cookies().cookies == "true"){
        document.cookie = `${data.name}=${data.value}; path=/`;
        return true;
    }
    else{
        ask_Cookies();
        return false;
    }
    }
if (!parse_Cookies().cookies){ask_Cookies();}