document.getElementById('earth').ondragstart = function() { return false; };

let closedleft = false
let closedright = false
function resizeSidebarLeft(){
    if (closedleft){
        document.getElementById("left-sidebar").style.width = "88%";
    }else{
        document.getElementById("left-sidebar").style.width = "0px";
    }
    closedleft = !closedleft;
}
function resizeSidebarRight(){
    if (closedright){
        document.getElementById("right-sidebar").style.width = "88%";
    }else{
        document.getElementById("right-sidebar").style.width = "0px";
    }
    closedright = !closedright;
}

let earthdown = false;
function earthPress(){
    earthdown = true;
};
function ScreenRelease(){
    earthdown = false;
};

let overcanvas = false;
document.getElementById("canvas").onmouseenter = function(){
    overcanvas = true
}
document.getElementById('canvas').onmouseleave = function(){
    overcanvas = false
}