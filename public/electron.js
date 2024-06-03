const electron = require('electron')
const fs = require('fs')
const path = require('path')
const packageJson = require('../package.json')
const Menu = require('electron').Menu

global.version = packageJson.version

/* const {
  AudioFileInfoReader
} = require('./AppleLoopInfo') */
const { 
  convertPatch,
  kitDirInfo,
} = require('./converterScript/generatePatch')
const { 
  getGroupFx, 
  getSliceFx, 
  getMasterFx,
  getSelectedGroupFx,
  getSelectedSliceFx,
  getSelectedMasterFx,
  setGroupFx,
  setSliceFx,
  setMasterFx
} = require('./converterScript/effectHandler')

const {
  annotateFileInfo
} = require('./converterScript/exportFileInfo')

const { ipcMain, app, BrowserWindow } = electron

const argv = require('yargs')
  .options({
    'd': {
      alias: 'directory',
      describe: 'Path to the dir.',
      string: true
    },
    'o': {
      alias: 'output',
      describe: 'The output path.',
      string: true
    }
  }).argv


// invoked for cli
if (argv.d || argv.o) {
  (async () => {
    const { d: dir, o: outputPath } = argv
  
    if (!d) {
      console.error('No path specified.')
      process.exit(1)
    }
  
    if (o) {

    }
    app.quit()
  })()
} 

// invoked for UI 
else {

  const isDev = process.env.ENVIRONMENT === 'dev'

  let mainWindow

  function createWindow() {
    mainWindow = new BrowserWindow({width: 1200, height: 680, webPreferences: {nodeIntegration: true}})
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)
    mainWindow.on('closed', () => mainWindow = null)

    // From: https://electronjs.org/docs/api/menu#main-process
    const menu_template = [
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteandmatchstyle' },
          { role: 'delete' },
          { role: 'selectall' }
        ]
      },
      { // TODO: Maybe hide this in release versions
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          { role: 'toggledevtools' },
          { type: 'separator' },
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        role: 'window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      },
      // {
      //   role: 'help',
      //   submenu: [
      //     {
      //       label: 'Learn More',
      //       click () { require('electron').shell.openExternal('https://electronjs.org') }
      //     }
      //   ]
      // }
    ]

    if (process.platform === 'darwin') {
      menu_template.unshift({
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      })

      // Edit menu
      menu_template[1].submenu.push(
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' }
          ]
        }
      )

      // Window menu
      menu_template[3].submenu = [
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      ]
    }

    const menu = Menu.buildFromTemplate(menu_template)
    Menu.setApplicationMenu(menu)
  }

  const userDataPath = app.getPath('userData')

  app.on('ready', createWindow)

  app.on('window-all-closed', () => {
      app.quit()
  })
  
  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
      createMenu()
    }
  })

  ipcMain.on('kitDirInfo', async (event, args) => {
    const { dir } = args
    const info = await kitDirInfo(dir)
    event.sender.send('kitDirInfo', info)
  })

  ipcMain.on('export', (event, args) => {
    const { files, dir, skuid } = args
    const exportPath = path.join(dir, 'info.json')
    try {
      const info = files.map( file => annotateFileInfo(file, dir, skuid) )
      const sInfo = JSON.stringify(info, null, 2)
      fs.writeFile(exportPath, sInfo, err => {
        if (err) {
          event.sender.send('exportError', err)
        } else {
          event.sender.send('exportSuccess', exportPath)
        }
      })
    } catch (err) {
      event.sender.send('exportError', err.toString())
    }
  })

  ipcMain.on('convertPatch', (event, arg) => {
    const { dir, beatStretchModes, songSections } = arg

    convertPatch(userDataPath, dir, msg => {
      event.sender.send(`convert${msg.type.substring(0, 1).toUpperCase()}${msg.type.substring(1)}`, msg.message)
    }, beatStretchModes, songSections)
    .then( res => {
      event.sender.send('convertDone', res)
    })
    .catch( err => {
      event.sender.send('convertError', err.toString())
    })
  })

  ipcMain.on('getFx', (event, arg) => {
    const { busType } = arg
    let fx = null
    switch (busType) {
      case 'group': {
        fx = getGroupFx()
        break
      }
      case 'slice': {
        fx = getSliceFx()
        break
      }
      case 'master': {
        fx = getMasterFx()
        break
      }
      default: {
        event.sender.send('error', new Error(`No FX found for type: ${busType}`))
        return
      }
    }
    event.sender.send('getFx', {fx, type: busType})
  })

  ipcMain.on('selectedFx', (event, arg) => {
    const { busType } = arg
    let fx = null
    switch (busType) {
      case 'group': {
        fx = getSelectedGroupFx(userDataPath)
        break
      }
      case 'slice': {
        fx = getSelectedSliceFx(userDataPath)
        break
      }
      case 'master': {
        fx = getSelectedMasterFx(userDataPath)
        break
      }
      default: {
        event.sender.send('error', new Error(`No FX found for type: ${busType}`))
        return
      }
    }
    event.sender.send('selectedFx', {fx, type: busType})
  })

  ipcMain.on('setFx', (event, arg) => {
    const {busType, ids} = arg
    switch (busType) {
      case 'group': {
        fx = setGroupFx(userDataPath, ids)
        break
      }
      case 'slice': {
        fx = setSliceFx(userDataPath, ids)
        break
      }
      case 'master': {
        fx = setMasterFx(userDataPath, ids)
        break
      }
      default: {
        event.sender.send('error', new Error(`No FX found for type: ${busType}`))
        return
      }
    }
    event.sender.send('setFx', {busType, ids})
  })



}