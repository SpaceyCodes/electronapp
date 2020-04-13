const electron = require('electron');
const url = require('url');
const path = require('path');
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const {app, BrowserWindow, Menu, globalShortcut, shell, webContents} = require('electron');

let mainWindow;

app.on('ready', function(){
    mainWindow = new BrowserWindow({hasShadow: false, frame: false, minWidth: 200 ,minHeight: 45, webPreferences: {nodeIntegration:true}});
    mainWindow.setPosition(1720,0);
    mainWindow.setSize(200,45);
    Menu.setApplicationMenu(null);
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protcol:'file',
        slashes: true
    }));
    globalShortcut.register('Alt+.', () => {
        mainWindow.focus();
        mainWindow.setPosition(1720,0);
        mainWindow.setSize(200,45);
    });
    ipc.on('changesize init', function(event, sizeX, sizeY, posX, posY) {
        mainWindow.setPosition(1720,0);
        mainWindow.setSize(sizeX, sizeY);
        console.log(posX, posY);
        mainWindow.setPosition(posX, posY);
    })
    ipc.on("chrome init", function(event, arg) {
        shell.openExternal(arg);
    })
    ipc.on("init", function(event, arg) {
        console.log('dwa')
        console.log(arg)
    })
    ipc.on("minimise", function(event) {
        mainWindow.minimize();
    })
});

