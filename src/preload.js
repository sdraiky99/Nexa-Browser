const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('nexa', {
  openExternal: (url) => ipcRenderer.invoke('open-external', url)
});
