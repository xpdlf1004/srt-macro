const { app, BrowserWindow } = require("electron");
require("../server/app");
const serve = require("electron-serve");

let loadURL;
if (!app.isPackaged) {
    console.log("Run in development");
    loadURL = serve({ directory: "../dist/" });
} else {
    console.log("Run in package");
    loadURL = serve({ directory: "./dist/" });
}

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({ width: 1280, height: 800 });

    setTimeout(() => {
        // Wait until electron-serve register the "app://" scheme.
        // See https://github.com/sindresorhus/electron-serve/issues/18
        loadURL(win);
    }, 1000);
}

app.on("window-all-closed", () => {
    app.quit();
});

app.on("ready", () => {
    createWindow();
});

import "./applicationMenu";
