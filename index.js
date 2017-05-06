const { resolve } = require('path')
const { format } = require('url')
const electron = require('electron')
const isRemote = electron.remote !== void 0
const { TouchBar, BrowserWindow } = isRemote ? electron.remote : electron

electron.app.on('ready', () => {
  const win = new BrowserWindow({
  })

  win.loadURL(format({
    pathname: resolve(__dirname, 'app', 'index.html'),
    protocol: 'file:',
    slashes: true,
  }))

  win.webContents.openDevTools();
})

electron.app.on('window-all-closed', () => {
  electron.app.quit()
})
