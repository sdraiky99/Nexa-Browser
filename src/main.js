const { app, BrowserWindow, session, ipcMain, shell } = require('electron');
const path = require('path');

const TRACKER_PATTERNS = [
  'google-analytics.com', 'googletagmanager.com', 'doubleclick.net',
  'facebook.net', 'connect.facebook.net', 'adservice.google.com',
  'googlesyndication.com', 'amazon-adsystem.com', 'scorecardresearch.com',
  'hotjar.com', 'segment.io', 'mixpanel.com'
];

const AD_PATTERNS = [
  '/ads/', '/adservice', '/advert', 'banner', 'doubleclick',
  'googlesyndication', 'adnxs.com', 'taboola.com', 'outbrain.com'
];

function matchesPattern(url, patterns) {
  const value = String(url || '').toLowerCase();
  return patterns.some(pattern => value.includes(pattern));
}

function installPrivacyRules() {
  const ses = session.defaultSession;
  ses.webRequest.onBeforeRequest({ urls: ['<all_urls>'] }, (details, callback) => {
    const blocking = matchesPattern(details.url, TRACKER_PATTERNS) || matchesPattern(details.url, AD_PATTERNS);
    callback({ cancel: blocking });
  });

  ses.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };
    responseHeaders['Referrer-Policy'] = ['strict-origin-when-cross-origin'];
    responseHeaders['Permissions-Policy'] = ['geolocation=(), microphone=(), camera=()'];
    callback({ responseHeaders });
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 980,
    minHeight: 650,
    backgroundColor: '#08121f',
    title: 'Nexa Browser',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true,
      sandbox: true
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  return win;
}

app.whenReady().then(() => {
  installPrivacyRules();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('open-external', (_event, url) => shell.openExternal(url));
