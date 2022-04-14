function request(method, url, body, callback){
    req = new XMLHttpRequest();
    req.onreadystatechange = ()=>{
        if (req.status == 200 && req.readyState == 4){
            if (callback){
                callback(req.responseText);
            }
        }
    }
}

function get_Id(state){
    let path_Name = window.location.pathname;
    console.log(path_Name.split("/")[1]);
    if (path_Name.split("/")[1] == "products" && path_Name.split("/")[2]){
        let id = path_Name.split("/")[2];
        get_Datas(id, state);
        return false;
    }
    return true;
}

function get_Datas(id, state){
    for (let i = 0; i < state.products.length; i++){
        if (state.products[i].id == id){
            element_Datas(state.products[i]);
        }
    }
}

function element_Datas(datas){
    console.log(datas);
    let html = `
        <h1 class = "title">${datas.name}</h1>
        <img class = "product_Image" src = "/${datas.image}"></img>
        <h1 class = "price">${datas.price}</h1>
        <p class = "description">${datas.description}</p>
    `;
    document.getElementById("conteiner").innerHTML = html;
}

window.onload = send_Request("GET", "products.json", "", load_Products);