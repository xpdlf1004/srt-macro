const { app, BrowserWindow, protocol } = require("electron");
require("../server/app");
const serve = require("electron-serve");

let loadURL;
if (process.env.NODE_ENV) {
    loadURL = serve({ directory: "../dist/" });
} else {
    loadURL = serve({ directory: "./dist/" });
}

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({ width: 1280, height: 800 });

    loadURL(win);
}

app.on("window-all-closed", () => {
    app.quit();
});

app.on("ready", () => {
    createWindow();
});
