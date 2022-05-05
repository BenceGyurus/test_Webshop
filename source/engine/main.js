var datas = [];
function random_Id(length){
    length = length ? length : 100;
    id = "";
    chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
    for (let i = 0; i < length; i++){
        id += chars[Math.floor(Math.random()*(chars.length-1))];
    }
    return id;
}

class html{
    static div(id,class_Name,data){
        return `<div id = "${id}" class = "${class_Name}">${data}</div>`;
    }
    static input(id,class_Name,type,placeholder,value, name, onclick){
        return `<input type = "${type}" id = "${id}" class = "${class_Name}" ${placeholder ? `placeholder = "${placeholder}"` : ""} value = "${value}" name = "${name}" ${onclick?`onclick=${onclick}`:""}>`;
    }
    static label(id, class_Name, data, for_This){
        return `<label ${for_This?`for = ${for_This}`: ""} id = "${id}" class = "${class_Name}">${data}</label>`
    }
    static img(id, class_Name, src, onclick){
        return `<img src = "${src}" class = "${class_Name}" id = "${id}" ${onclick?`onclick="${onclick}"`:""}/>`
    }
}

function get_Value(id){
    try{
        return document.getElementById(id).value ? document.getElementById(id).value : "";
    }
    catch{
        return false;
    }
}

function re_Save_Datas(data){
    for (let i = 0; i < window.all_List.length; i++){
        if (all_List[i]){
        for (let j = 0; j < window.edit_List.length; j++){
            try{
            insert(data[window.all_List[i]][window.edit_List[j]][1], data[window.all_List[i]][window.edit_List[j]][0]);
            }catch{}
        }
        for (let j = 0; j < window.radio.length; j++){
            try{
            element = document.getElementsByName(data[window.all_List[i]][window.radio[j]][1]);
            for (let k = 0; k < element.length; k++){
                
                if (element[k].value == String(data[window.all_List[i]][window.radio[j]][0])){
                    element[k].checked = true;
                }
            }
            }
            catch{}
        }
    }
    }
}

function save_Datas(){
    data = {};
    for (let i = 0; i < window.all_List.length; i++){
        if (all_List[i]){
            data[all_List[i]] = {}
            for (let j = 0; j < window.edit_List.length; j++){
                //console.log(get_Value(window.datas[window.all_List[i]][window.edit_List[j]]), window.datas[window.all_List[i]][window.edit_List[j]]);
                data[window.all_List[i]][window.edit_List[j]] = [get_Value(window.datas[window.all_List[i]][window.edit_List[j]]), window.datas[window.all_List[i]][window.edit_List[j]]]
            }
            for (let j = 0; j < window.radio.length; j++){
                data[window.all_List[i]][window.radio[j]] = [document.querySelector(`input[name="${window.datas[window.all_List[i]][window.radio[j]]}"]:checked`).value,window.datas[window.all_List[i]][window.radio[j]]];
            }
        }    
    }
    return data;
}

function insert(id, data){
    try{
        document.getElementById(id).value = data;
    }
    catch{}
}