function load(){
    let padding = 30;
    let screen_Width = window.innerWidth;
    let element_Width = screen_Width > 300 ? 300 : Math.floor(element_Width*0.5);
    document.getElementById("conteiner").style.left = `${Math.ceil(screen_Width/2-(element_Width/2+padding))}px`;
    document.getElementById("conteiner").style.padding = `${padding}px`;
}

load();