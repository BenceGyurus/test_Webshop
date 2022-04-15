
function logout(){
    cookie.delete_Cookie("login_Token");
    window.location = "/admin-login"
}

function request(){

}

function get_Admin_Rule(){
    console.log(parse_Cookies());
    if (parse_Cookies().login_Token){
        write_Alert("Soha ne adja meg senkinek a jelszavát!", "warning");
    }
    else{
       window.location = "/admin-login";
    }
}

window.onload = get_Admin_Rule;