const { app, BrowserWindow, protocol } = require("electron");
require("../server/app");
const serve = require('electron-serve');

const loadURL = serve({directory: "../dist/"});

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({ width: 1280, height: 800 });

    loadURL(win);
}

app.on("ready", () => {
    createWindow();
});
