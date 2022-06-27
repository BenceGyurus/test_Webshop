function get_Params(){
    url = window.location.pathname;
    return url.split("/");
}

function query_This_Produt(){
    console.log(get_Params());
}

window.onload = query_This_Produt();