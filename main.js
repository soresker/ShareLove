
const { app, BrowserWindow,globalShortcut,ipcMain} = require('electron') 
const { autoUpdater } = require('electron-updater');
const logOpen = require('../ShareLove/lib/log');
const logger = require('../ShareLove/lib/log').logger;
const mpvAPI = require('node-mpv');

'use strict'

//App Window Code Block Start 

function createWindow () { 

    const win = new BrowserWindow({ 
    width: 1024, 
    height: 768,
    autoHideMenuBar: true,
    show: true,
    frame: true, 
    webPreferences: { 
      nodeIntegration: true
    } 
  }) 
  
  win.loadFile('src/index.html');

  win.once('ready-to-show', () => {
		
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    win.show();
    logger.info('Main', '[ShareLive App Ready To Show');
    
    if (!app.isPackaged) 
    win.webContents.openDevTools();

    //logOpen.FileLogging();
  
  });
  
  win.on('closed', () => {
    win = null;
  });
} 

//App Window Code Block End 

//Electron App Code Block Start 

app.on('second-instance', () => {
  logger.warn("second-instance opening ");
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.whenReady().then(createWindow) 

app.on('window-all-closed', () => { 
  if (process.platform !== 'darwin') { 
    app.quit() 
  } 
}) 
  
app.on('activate', () => { 
  if (BrowserWindow.getAllWindows().length === 0) { 
    createWindow() 
  } 
}) 
  
//Electron App Code Block End 

//MPV player Code Block Start 

 playerStart = async (path) => {

  const mpv = new mpvAPI({
    "verbose": true,
  },
  [
    "--fullscreen",
    "--fps=60"
  ]);

  try{
    await mpv.start();
    await mpv.load(path[0]);
    await mpv.volume(30);
  }
  catch (error) {
    logger.error(error);
  }

};

//MPV player Code Block END 

//Updater Code Block Start 

logger.info('Main', '[ShareLive App] Updater Init');

autoUpdater.checkForUpdates()
  .catch((err) => logger.info('ShareLive UPDATER', 'ShareLive update not available', '1'));

autoUpdater.on('checking-for-update', () => {
  logger.info('UPDATER', 'Checking for update', '1');
});

autoUpdater.on('update-available', (info) => {
  logger.info('UPDATER', `Update available: ${info.version}`, '1');
});

autoUpdater.on('update-not-available', (info) => {
  logger.info('UPDATER', 'Update not available', '1');
});

autoUpdater.on('error', (err) => {
  logger.info('UPDATER', `Error in auto-updater: ${err}`, '1');
});

autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
  logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
  logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
  logger.info('UPDATER', logMessage, '1');
});

autoUpdater.on('update-downloaded', (info) => {

  logger.info('UPDATER', 'Update finished', '1');
  autoUpdater.quitAndInstall();
});

//Updater Code Block End 

//IPC Communication Code Block Start

ipcMain.on('drop-files', (event, arg) => {
  logger.info("File Paths:",arg) // prints "ping"
  event.reply('drop-files-answer', 'ok')
  //playerStart(arg);
})

//IPC Communication Code Block End
