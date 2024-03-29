import { SelectObject, HandleMousePosition, AddObject, HandleResize } from "../js/main.js";

const globals = {
    currentpressed: null,
    overcanvas: false,
    currentover: null,
    currentselected: null,
}
const canvas =  document.getElementById('canvas');
const tutor = document.getElementById("tutor-popup");
const overlay = document.getElementById("overlay-popup")

const planetimages = document.querySelectorAll(".planet");
planetimages.forEach(function(element) {
    element.ondragstart = () => {return false}
});

let closedleft = false;
let closedright = false;
document.getElementById("left-sidebar-button").onclick = function(){
    if (closedleft){
        document.getElementById("left-sidebar").style.width = "88%";
    }else{
        document.getElementById("left-sidebar").style.width = "0px";
    }
    closedleft = !closedleft;
}
document.getElementById("right-sidebar-button").onclick = function(){
    if (closedright){
        document.getElementById("right-sidebar").style.width = "88%";
    }else{
        document.getElementById("right-sidebar").style.width = "0px";
    }
    closedright = !closedright;
}

document.getElementById("popup-button").onclick = function(){
    tutor.style.display = "none";
    overlay.style.display = "none"
}

document.getElementById("earth").onmousedown = function(){
    globals.currentpressed = "Earth";
};
document.getElementById("moon").onmousedown = function(){
    globals.currentpressed = "Moon";
};
document.body.onmouseup = function(){
    globals.currentpressed = null
}

canvas.onmouseenter = function(){
    globals.overcanvas = true
}
canvas.onmouseleave = function(){
    globals.overcanvas = false
}

canvas.onclick = function(){
	if (globals.currentover){
		SelectObject(globals.currentover)
	}
}
canvas.onmouseup = function(){
    if (globals.currentpressed){
        AddObject()
	};
};

window.onresize = () => HandleResize();
window.onmousemove = (e) => HandleMousePosition(e);

function ShowPopupTutor(){
    tutor.style.display = "flex";
    overlay.style.display = "flex"
}

window.onload = function(){
    if (!localStorage.getItem("tutor_shown")){
        ShowPopupTutor();
        // localStorage.setItem("tutor_shown", true);
    }
    
}

export { globals }