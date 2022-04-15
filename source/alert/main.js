function animation(){
    let top = -300; 
    interval = setInterval(()=>{
        top++;
        document.getElementById("alert").style.top = `${top}px`;
        if (top == 10){
            clearInterval(interval);
        }
    }, 1);
}

function re_Animation(){
    let top = 10; 
    interval = setInterval(()=>{
        top--;
        document.getElementById("alert").style.top = `${top}px`;
        if (top == -300){
            document.getElementById("alert").remove();
            clearInterval(interval);
        }
    }, 1);
}


function write_Alert(text, type){
    type = type ? "#ff9500" : "red";       //error, warning
    req= new XMLHttpRequest();
    req.onreadystatechange = ()=>{
        if (req.status == 200 && req.readyState == 4){
            try{
                document.getElementById("alert").remove();
            }
            catch{}
            document.body.innerHTML+=req.responseText;
            document.getElementById("text").innerHTML = text;
            s_Width = window.innerWidth;
            let width = 500;
            if (s_Width < 600){
                width = Math.ceil(s_Width*0.7);
                pos = Math.ceil((s_Width/2)-((width*1.15)/2));
            }
            else{
                pos = Math.ceil((s_Width/2)-((width)/2));
            }
            animation();
            document.getElementById("alert").style.background = type;
            document.getElementById("alert").style.width = `${width}px`;
            document.getElementById("alert").style.left = `${pos}px`;
            setTimeout(()=>{
                try{
                re_Animation();
                }
                catch{}
            }, 4000);
        }
    }
    req.open("GET", "/alert/index.html");
    req.send()
}