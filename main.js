const { app, BrowserWindow, session } = require('electron');
const path = require('path');

// Change to match your folder
const EXT_PATH = path.join(__dirname, 'youtube-extension', '1.2.1_0');

let extLoaded = false;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, 'assets', 'icon.ico'), // ✅ Custom icon
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: false
    }
  });

  // Load any site (Google by default)
  win.loadURL("https://www.google.com");

  // Load extension ONLY when YouTube is visited
  win.webContents.on('did-navigate', async (_, url) => {
    if (url.includes('youtube.com') && !extLoaded) {
      try {
        await session.defaultSession.extensions.loadExtension(EXT_PATH); // ✅ Electron 28+
        console.log("✅ YouTube extension loaded");
        extLoaded = true;
      } catch (err) {
        console.error("❌ Failed to load extension:", err);
      }
    }
  });
}

app.whenReady().then(createWindow);
