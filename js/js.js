const formval = document.getElementById("form");
const electron = require("electron");
const ipc = electron.ipcRenderer;
var fs = require('fs');
window.catTF = false;
window.amtTF = false;
window.search = true;
formval.focus();
function firestarter() {
    formval.addEventListener("click", function() {
        formclear();
    })
    formval.addEventListener("keydown", function(e) {
        if (e.keyCode ==13) {
            if (formval.value=='4') {
                window.search = false;
                window.catTF = true;
                ipc.send("init", window.search );
            }
            else if (window.search) {
                ipc.send("init", window.search );
                let website = "https://www.google.com/search?q=".concat(formval.value);
                ipc.send("chrome init", website);
            }
            else if (catTF) {
                window.catagory = formval.value;
                window.catTF = false;
                window.amtTF = true;
            }
            else if (amtTF) {
                window.amount = formval.value;
                window.amtTF = false;
                window.search = true;
                moneytracker();
            }
            ipc.send("init", window.search );
            formclear()
        }
    })
}
function formclear() {
    formval.value = "";
}
function moneytracker() {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.toLocaleString('default', {month: 'short'});
    fs.appendFile(`${month}${year}.csv`, `${window.catagory},$${window.amount}\n` ,function(error){
        if (error) throw error;
        console.log('saved');
    })
}
firestarter();
//----------------TopBar----------------------
const minimisebut = document.getElementById("button1");
const maximisebut = document.getElementById("button2");
const closebut = document.getElementById("button3");
function starter() {
    closebut.addEventListener("click", function(){
        window.close();
    });
    maximisebut.addEventListener("click", function(){
        if (window.innerHeight != screen.availHeight && window.innerWidth != screen.availWidth) {
            window.oldheight = window.innerHeight;
            window.oldwidth = window.innerWidth;
            window.oldscreenX = window.screenX;
            window.oldscreenY= window.screenY;
            window.resizeTo(screen.availWidth, screen.availHeight);
            formval.focus();
        } else {
            let sizew = window.oldwidth
            let sizeh = window.oldheight
            let posx = window.oldscreenX;
            let posy = window.oldscreenY;
            ipc.send('changesize init', sizew, sizeh, posx, posy)
            formval.focus();
        }

    });
    minimisebut.addEventListener("click", function(){
        ipc.send("minimise");
    });
}

starter();
