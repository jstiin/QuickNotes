const { app, BrowserWindow, globalShortcut, Tray, Menu } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let force = false;
const createWindow = () => {
  // Create the browser window.
   mainWindow = new BrowserWindow({
    width: 360,
    height: 400,
    resizable: false,
    maximizable: true,
    fullscreenable: false,
    autoHideMenuBar: true,
    frame: true,
    icon: path.join(__dirname, './icons/appIcon256.png'),
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.on('close', (event) => {
    if(!force) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.commandLine.appendSwitch('enable-features', 'GlobalShortcutsPortal');

app.whenReady().then(() => {
  createWindow();
  const reg = globalShortcut.register('Alt+N', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  })

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  const tray = new Tray(path.join(__dirname, './icons/trayIcon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show/Hide',
      click: () => {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        force = true;
        app.quit();
      },
    },
  ]);
  tray.setToolTip('Quick Notes');
  tray.setContextMenu(contextMenu);

});

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister('Alt+N')

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
