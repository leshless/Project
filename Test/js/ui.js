let closed = false
function changeSidebar(){
    console.log("OK")
    if (closed){
        document.getElementById("left-sidebar").style.width = "13%";
    }else{
        document.getElementById("left-sidebar").style.width = "0px";
    }
    closed = !closed
}