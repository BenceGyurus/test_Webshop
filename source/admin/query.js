function query(url, callback){
    let req = new XMLHttpRequest;
    req.onreadystatechange = ()=>{
        if (req.status == 200 && req.readyState == 4){
            callback ? callback(req.responseText) : console.log("There is no callback function");
        }
        else if (req.status == 404){
            write_Alert("Hiba történt az oldal betöltése közben", "", "Hiba");
        }
    }
    req.open("POST", url);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(JSON.stringify({
        token : parse_Cookies().login_Token
    }))
}

function send(method, url, data, callback){
    let req = new XMLHttpRequest;
    req.onreadystatechange = ()=>{
        if (req.status == 200 && req.readyState == 4){
            callback ? callback(req.responseText) : console.log("There is no callback function");
        }
        else if (req.status == 404){
            write_Alert("Hiba történt az oldal betöltése közben", "", "Hiba");
        }
    }
    req.open(method, url);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(data)
}