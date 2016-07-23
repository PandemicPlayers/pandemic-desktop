const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;

let win;

// const installExtensions = async () => {
//   if (process.env.NODE_ENV === 'development') {
//     const installer = require('electron-devtools-installer'); // eslint-disable-line global-require
//     const extensions = [
//       'REACT_DEVELOPER_TOOLS',
//       'REDUX_DEVTOOLS'
//     ];
//     const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
//     for (const name of extensions) {
//       try {
//         await installer.default(installer[name], forceDownload);
//       } catch (e) {} // eslint-disable-line
//     }
//   }
// };

function createWindow() {
  // await installExtensions();

  win = new BrowserWindow({width: 1600, height: 1200});
  win.loadURL(`file://${__dirname}/index.html`);
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

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
