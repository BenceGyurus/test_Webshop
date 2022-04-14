function ajax_Request(url, method, body){
    let req = new XMLHttpRequest();
    req.onreadystatechange = ()=>{
        if (req.status == 200 && req.readyState == 4){
            document.getElementById("result").innerHTML = req.responseText;
        }
    };
    req.open(method, url);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(body);
}

function send_Datas(){
    method = document.getElementById("method").value;
    url = document.getElementById("url").value;
    body = document.getElementById("body").value;
    ajax_Request(url, method, body);
}