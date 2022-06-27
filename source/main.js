state = {};
function send_Request(method, url, body, callback){
    req = new XMLHttpRequest();
    req.onreadystatechange = () =>{
        console.log(req.status, req.readyState);
        if (req.status == 200 && req.readyState == 4){
            if (callback){
                callback(req.responseText);
            }
        }
    }
    req.open(method, `/${url}`);
    req.send(body);
}

function new_Tab(id){
    url = `products/${id}`;
    console.log(url);
    window.open(url);
}

function load_Products(state){
    let html = "";
    state = JSON.parse(state);
    window.state = state;
    if (get_Id(state)){
    console.log(state.products.length);
    for (let i = 0; i<state.products.length; i++){
        //send_Request("GET", state.products[i].image, "", "");
        html += `<div class = 'product'>
            <img class = "image_Of_Product" alt = "product_Image" src = "/${state.products[i].image}"></img>
            <h1 class = 'name_Of_Product'>${state.products[i].name}</h1>
            <label class = '${state.products[i].isInStock?'in_Stock':'isnt_In_Stock'}'>${state.products[i].isInStock?'Raktáron':'Nincs raktáron'}</label>
            <h2 class = 'price_Of_Product'>${state.products[i].price}Ft</h2>
            <input type = "button" value = "Részletek" class = "details" onclick = "new_Tab('${state.products[i].id}')">
        </div>`
    }
    document.getElementById("conteiner").innerHTML += html;
    }
}
//window.onload = load_Window();