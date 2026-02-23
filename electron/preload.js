const { contextBridge, ipcRenderer } = require('electron')

// Get platform using process.platform (available in preload context)
const platform = process.platform

contextBridge.exposeInMainWorld('electron', {
  platform: platform,
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) => ipcRenderer.on(channel, func)
})
