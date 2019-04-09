// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from 'path'
import url from 'url'
import { app, Menu } from 'electron'
import { devMenu } from './menu/dev'
import { editMenu } from './menu/edit'
import createWindow from './utils/createWindow'
import { serverConfig } from '../config'

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
const NODE_ENV = process.env.NODE_ENV || 'development'

const setApplicationMenu = () => {
  const menus = [editMenu]
  if (NODE_ENV !== 'production') {
    menus.push(devMenu)
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus))
}

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (NODE_ENV !== 'production') {
  const userDataPath = app.getPath('userData')
  app.setPath('userData', `${userDataPath} (${NODE_ENV})`)
}

app.on('ready', () => {
  setApplicationMenu()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600
  })
  if (NODE_ENV === 'development') {
    mainWindow.loadURL(`http://localhost:${serverConfig.port}`)
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.resolve(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )
  }

  if (NODE_ENV === 'development') {
    mainWindow.openDevTools()
  }
})

app.on('window-all-closed', () => {
  app.quit()
})
