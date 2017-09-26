
var ipcRenderer = null;

if (window.hasOwnProperty("require")) {
    const electron = window.require('electron');
    ipcRenderer = electron.ipcRenderer;
} else {
    console.log("electron Ipc disabled")
}


function rrsend(params) {
    if (ipcRenderer) {
        ipcRenderer.send('rr',params);
    }
}

function appQuit() {
    rrsend({action:"quit"});
}

function toggleFullScreen() {
    rrsend({action:"togglefs"});
}
function setFullScreen() {
    rrsend({action:"setfs"});
}
function clearFullScreen() {
    rrsend({action:"clearfs"});
}

function openDevTools() {
    rrsend({action:"devtools"});
}


module.exports = {
  appQuit: appQuit,
  toggleFullScreen:toggleFullScreen,
  setFullScreen: setFullScreen,
  clearFullScreen: clearFullScreen,
  openDevTools: openDevTools
};
