let closedleft = false
let closedright = false
function resizeSidebarLeft(){
    if (closedleft){
        document.getElementById("left-sidebar").style.width = "13%";
    }else{
        document.getElementById("left-sidebar").style.width = "0px";
    }
    closedleft = !closedleft;
}
function resizeSidebarRight(){
    if (closedright){
        document.getElementById("right-sidebar").style.width = "13%";
        document.getElementById("right-sidebar-button").style.right = "13%";
    }else{
        document.getElementById("right-sidebar").style.width = "0px";
        document.getElementById("right-sidebar-button").style.right = "0";
    }
    closedright = !closedright;
}