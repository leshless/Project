document.getElementById('earth').ondragstart = function() {return false; };
document.getElementById('moon').ondragstart = function() {return false; };

let closedleft = false
let closedright = false
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

let currentpressed = null;
function earthPress(){
    currentpressed = "earth";
};
function moonPress(){
    currentpressed = "moon";
};
document.getElementById("body").onmouseup = function(){
    currentpressed = null;
}

let overcanvas = false;
document.getElementById("canvas").onmouseenter = function(){
    overcanvas = true
}
document.getElementById('canvas').onmouseleave = function(){
    overcanvas = false
}

const tbl = document.getElementById('description');
let currentover = null;
currentselected = null;

