const _ = require('lodash');
const electron = require('electron');
const {BrowserWindow, app, ipcMain} = electron;

let win;

function createWindow() {
  win = new BrowserWindow({width: 1600, height: 1200, nodeIntegration: true});
  win.loadURL(`file://${__dirname}/index.html`);
  if (process.env.DEBUG) {
    win.webContents.openDevTools();
  }
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', () => {
  _.times(process.env.WINDOWS || 1, (i) => createWindow());
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('get-pandemic-socket-url', (event) => {
  event.returnValue = process.env.PANDEMIC_SOCKET || 'ws://localhost:4000/socket';
});
