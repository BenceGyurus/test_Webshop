
function request(){

}

function get_Admin_Rule(){
    console.log(parse_Cookies());
    if (parse_Cookies().login_Token){

    }
    else{
       window.location = "/admin-login";
    }
}

window.onload = get_Admin_Rule;