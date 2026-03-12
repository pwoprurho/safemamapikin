const { app, BrowserWindow, Menu, shell, session } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Kusmus AI Community',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Disabling webSecurity for local AI inference to talk to localhost:11434
      // Alternatively, we use the header interceptor below for better security
      webSecurity: true,
      backgroundColor: '#0a0f1c',
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
  });

  // Handle CORS for local Ollama instance (localhost:11434)
  // This allows the remote Kusmus Community Hub to communicate with your local AI
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };
    
    // If the request is coming from our trusted community hub and going to localhost
    if (details.url.includes('127.0.0.1:11434') || details.url.includes('localhost:11434')) {
      responseHeaders['Access-Control-Allow-Origin'] = ['https://kusmus.com'];
      responseHeaders['Access-Control-Allow-Methods'] = ['GET, POST, OPTIONS'];
      responseHeaders['Access-Control-Allow-Headers'] = ['Content-Type, Authorization'];
    }

    callback({ responseHeaders });
  });

  // Load the Community Hub
  mainWindow.loadURL('https://kusmus.com/community');

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://kusmus.com')) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Application Menu
  const menuTemplate = [
    {
      label: 'Kusmus AI',
      submenu: [
        { label: 'About Kusmus AI', role: 'about' },
        { type: 'separator' },
        { label: 'Home', click: () => mainWindow.loadURL('https://kusmus.com') },
        { label: 'Community Hub', click: () => mainWindow.loadURL('https://kusmus.com/community') },
        { label: 'Sovereign Solutions', click: () => mainWindow.loadURL('https://kusmus.com/solutions') },
        { type: 'separator' },
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.reload() },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' }, { role: 'redo' }, { type: 'separator' },
        { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
