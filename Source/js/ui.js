let closedleft = false;
let closedright = false;

const canvas = document.getElementById('canvas');
const tbl = document.getElementById('description')

let currentpressed = null;
let overcanvas = false;

document.getElementById('earth').ondragstart = function(){return false};
document.getElementById('moon').ondragstart = function(){return false};

document.getElementById("left-sidebar-button").onclick =function(){
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

document.getElementById("earth").onmousedown = function(){
    currentpressed = "Earth";
};
document.getElementById("moon").onmousedown = function(){
    currentpressed = "Moon";
};
document.body.onmouseup = function(){
    currentpressed = null
}

canvas.onmouseenter = function(){
    overcanvas = true
}
canvas.onmouseleave = function(){
    overcanvas = false
}

