import React, { Component } from 'react'
import './App.css'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'
import { FileList } from './FileList'
import { FileDetailsModal } from './FileDetailsModal';
import { AppCommandBar } from './AppCommandBar'
import { EffectsModal } from './EffectsModal';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { KitInfo } from './KitInfo';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import Message from './Message'


const electron = window.require('electron')
const { ipcRenderer } = electron

class App extends Component {

  _dropZoneRef

  state = {
    messages: [],
    session: {
      log: [],
      files: [],
      instFilePath: null,
      kitId: null,
      kitName: null,
      kitSubtitle: null,
      samplesInDir: [],
      selectedFile: null,
      scanning: false,
      showDetailsModal: false,
      scanDir: null,
      canConvertPatch: false,
      fileSelection: null,
      showEffectsModal: false,
      beatStretchModes: new Array(400).fill(1),
      effects: {
        group: [],
        slice: [],
        master: []
      },
      selectedEffects: {
        group: [],
        slice: [],
        master: []
      },
      songSections: [],
      selectedSongSections: [],
    }
  }

                                                                                                                              
  // 8 8888          8 8888 8 8888888888   8 8888888888       ,o888888o.  `8.`8888.      ,8'  ,o888888o.    8 8888         8 8888888888   
  // 8 8888          8 8888 8 8888         8 8888            8888     `88. `8.`8888.    ,8'  8888     `88.  8 8888         8 8888         
  // 8 8888          8 8888 8 8888         8 8888         ,8 8888       `8. `8.`8888.  ,8',8 8888       `8. 8 8888         8 8888         
  // 8 8888          8 8888 8 8888         8 8888         88 8888            `8.`8888.,8' 88 8888           8 8888         8 8888         
  // 8 8888          8 8888 8 888888888888 8 888888888888 88 8888             `8.`88888'  88 8888           8 8888         8 888888888888 
  // 8 8888          8 8888 8 8888         8 8888         88 8888              `8. 8888   88 8888           8 8888         8 8888         
  // 8 8888          8 8888 8 8888         8 8888         88 8888               `8 8888   88 8888           8 8888         8 8888         
  // 8 8888          8 8888 8 8888         8 8888         `8 8888       .8'      8 8888   `8 8888       .8' 8 8888         8 8888         
  // 8 8888          8 8888 8 8888         8 8888            8888     ,88'       8 8888      8888     ,88'  8 8888         8 8888         
  // 8 888888888888  8 8888 8 8888         8 888888888888     `8888888P'         8 8888       `8888888P'    8 888888888888 8 888888888888 

  
  constructor(props) {
    super(props)

    initializeIcons(/* optional base url */)

    this._dropZoneRef = React.createRef()

    ipcRenderer.on('progress', (event, arg) => {
      this.setState((state, props) => ({
        session: {
          ...state.session,
          progress: arg.progress
        }
      }))
    })

    ipcRenderer.on('exportSuccess', (event, arg) => {
      this.addMessage({type: Message.type.success, isMultiline: false, truncated: true, teaser: 'Success!', text: arg.toString()})
    })

    ipcRenderer.on('exportError', (event, arg) => {
      this.addMessage({type: Message.type.error, isMultiline: false, truncated: true, teaser: 'Heads up!', text: arg.toString()})
    })

    ipcRenderer.on('convertWarn', (event, arg) => {
      this.addMessage({type: Message.type.warning, isMultiline: false, truncated: true, teaser: 'Warning!', text: arg.toString()})
    })

    ipcRenderer.on('convertInfo', (event, arg) => {
      this.addMessage({type: Message.type.info, isMultiline: false, truncated: true, teaser: 'Info!', text: arg.toString()})
    })

    ipcRenderer.on('convertError', (event, arg) => {
      this.addMessage({type: Message.type.error, isMultiline: false, truncated: true, teaser: 'Heads up!', text: arg.toString()})
    })

    ipcRenderer.on('convertDone', (event, arg) => {
      this.addMessage({type: Message.type.success, isMultiline: false, truncated: true, teaser: 'Success!', text: arg.toString()})
    })

    ipcRenderer.on('getFx', (event, arg) => {
      const { fx, type } = arg
      this.setState((state, props) => ({
        session: {
          ...state.session,
          effects: {
            ...state.session.effects,
            [type]: fx
          }
        }
      }))
    })

    ipcRenderer.on('selectedFx', (event, arg) => {
      const { fx, type } = arg
      this.setState((state, props) => ({
        session: {
          ...state.session,
          selectedEffects: {
            ...state.session.selectedEffects,
            [type]: fx
          }
        }
      }))
    })

    ipcRenderer.on('kitDirInfo', (event, arg) => {
      const { 
        instFilePath,
        kitId,
        kitName,
        kitSubtitle,
        mappedSamples,
        samplesInDir,
        canConvertPatch,
        errors
      } = arg

      this.setState((state, props) => ({
        session: {
          ...state.session,
          scanning: false,
          instFilePath,
          kitId,
          kitName,
          kitSubtitle,
          files: mappedSamples,
          samplesInDir,
          selectedSongSections: new Array(mappedSamples.length).fill(0).map( () => [] ),
          canConvertPatch,
        }
      }))
      console.log(arg)
      for (let error of errors) {
        this.addMessage({type: Message.type.error, isMultiline: false, truncated: true, teaser: `Heads up!`, text: error.toString()})
      }
    })

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this._dropZoneRef.current.ondragover = () => false
    this._dropZoneRef.current.ondragleave = () => false
    this._dropZoneRef.current.ondragend = () => false
  }

  componentDidMount() {
    this._dropZoneRef.current.ondragover = () => false
    this._dropZoneRef.current.ondragleave = () => false
    this._dropZoneRef.current.ondragend = () => false

    ipcRenderer.send('getFx', {busType: 'group'})
    ipcRenderer.send('getFx', {busType: 'slice'})
    ipcRenderer.send('getFx', {busType: 'master'})

    ipcRenderer.send('selectedFx', {busType: 'group'})
    ipcRenderer.send('selectedFx', {busType: 'slice'})
    ipcRenderer.send('selectedFx', {busType: 'master'})
  }

  render() {

    const {
      session,
      messages
    } = this.state

    const {
      files,
      selectedFile,
      scanning,
      showDetailsModal,
      showEffectsModal,
      canConvertPatch,
      fileSelection,
      effects,
      selectedEffects,
      beatStretchModes,
      songSections,
      selectedSongSections,
      instFilePath,
      kitId,
      kitName,
      kitSubtitle,
      samplesInDir,
    } = session

    const message = messages[0]


    return (
      <div className="App" ref={ this._dropZoneRef } onDrop={ e => {this._onFilesDropped(e)} }>

          <Stack style={{width: '100vw'}}>

            <Stack.Item>
              <AppCommandBar 
                  canConvertPatch={canConvertPatch}
                  convertPatch={ () => { this._convertPatch() } }
                  onExportSelection={ () => { this._exportInformation(fileSelection) } }
                  canExport={ fileSelection && !!fileSelection.length }
                  showEffectsModal={ () => { this._showEffectsModal(true) } }
              />
            </Stack.Item>

            {files.length > 0 &&
              <Stack.Item>
                <KitInfo
                  files={files}
                  instFilePath={instFilePath}
                  kitId={kitId}
                  kitName={kitName}
                  kitSubtitle={kitSubtitle}
                  samplesInDir={samplesInDir}
                />
              </Stack.Item>
            }

            {files.length > 0 &&
              <Stack.Item>
                <FileList
                  onSongSectionSelected={ (item, ix, val) => this._onSongSectionSelected(item, ix, val) }
                  selectedSongSections={ selectedSongSections }
                  onRemoveSongSection={ (ix) => this._onRemoveSongSection(ix) }
                  onAddSongSection={ (val) => this._onAddSongSection(val) }
                  songSections={ songSections }
                  beatStretchMode={ beatStretchModes }
                  onBeatStretchModeChanged={ (ix, val) => { this._onBeatStretchModeChanged(ix, val) } }
                  files={files} 
                  onItemInvoked={ file => { this._onSelectFile(file) }}
                  onSelectionChanged={ selection => { this._updateFileSelection(selection) } }
                />
              </Stack.Item>
            }

            {
              !files.length && !scanning &&
              <Stack.Item className="DropFilesHere">
                <div >Drop a folder here</div>
              </Stack.Item>
            }

            {scanning && 
              <Stack.Item className="ScanningInProgress">
                  <Spinner label="Exploring..." />
              </Stack.Item>
            }
          </Stack>

          {selectedFile && showDetailsModal &&
            <FileDetailsModal 
              show={showDetailsModal} 
              file={selectedFile} 
              onDismiss={ () => {this._hideDetailsModal()} } 
            />
          }

          {showEffectsModal &&
            <EffectsModal 
              show={showEffectsModal} 
              effects={effects}
              selectedEffects={selectedEffects}
              onDismiss={ () => {this._showEffectsModal()} } 
              onSelectedFxChanged={ (busType, slot, id) => {this._onSelectedFxChanged(busType, slot, id)} }
            />
          }

          { message && <Message message={message} dismiss={ () => {this.dismissMessage()}} dismissAll={ () => {this.dismissAllMessages()}} numMessages={messages.length}/> }

        </div>
    )
  }


  
// 8 8888        8 8 8888888888   8 8888         8 888888888o   8 8888888888   8 888888888o.     d888888o.   
// 8 8888        8 8 8888         8 8888         8 8888    `88. 8 8888         8 8888    `88.  .`8888:' `88. 
// 8 8888        8 8 8888         8 8888         8 8888     `88 8 8888         8 8888     `88  8.`8888.   Y8 
// 8 8888        8 8 8888         8 8888         8 8888     ,88 8 8888         8 8888     ,88  `8.`8888.     
// 8 8888        8 8 888888888888 8 8888         8 8888.   ,88' 8 888888888888 8 8888.   ,88'   `8.`8888.    
// 8 8888        8 8 8888         8 8888         8 888888888P'  8 8888         8 888888888P'     `8.`8888.   
// 8 8888888888888 8 8888         8 8888         8 8888         8 8888         8 8888`8b          `8.`8888.  
// 8 8888        8 8 8888         8 8888         8 8888         8 8888         8 8888 `8b.    8b   `8.`8888. 
// 8 8888        8 8 8888         8 8888         8 8888         8 8888         8 8888   `8b.  `8b.  ;8.`8888 
// 8 8888        8 8 888888888888 8 888888888888 8 8888         8 888888888888 8 8888     `88. `Y8888P ,88P' 

  addMessage(message) {
    this.setState(() => ({
      messages: [...this.state.messages, message]
    }))
  }

  dismissMessage() {
    this.setState(() => ({
      messages: this.state.messages.slice(1)
    }))
  }

  dismissAllMessages() {
    this.setState(() => ({
      messages: []
    }))
  }

  _onSongSectionSelected(fileIx, {key, text, selected}, songSectionIx) {
    const newSelectedSongSections = this.state.session.selectedSongSections.slice()

    if (!selected && newSelectedSongSections[fileIx].includes(key)) {
      newSelectedSongSections[fileIx] = newSelectedSongSections[fileIx].filter( songSection => songSection !== key )
    } else if (selected && !newSelectedSongSections[fileIx].includes(key)) {
      newSelectedSongSections[fileIx].push(key)
    }

    this.setState( (state, props) => {
      return {
        session: {
          ...state.session,
          selectedSongSections: newSelectedSongSections
        }
      }
    })
  }

  _onAddSongSection(val) {
    if (!this.state.session.songSections.find( ss => ss.name === val)) {
      this.setState( (state, props) => {
        return {
          session: {
            ...state.session,
            songSections: [...state.session.songSections, {name: val}]
          }
        }
      })
    }
  }

  _onRemoveSongSection(ix) {
    this.setState( (state, props) => {
      const songSections = state.session.songSections.slice()
      songSections.splice(ix, 1)
      return {
        session: {
          ...state.session,
          songSections
        }
      }
    })
  }

  _onBeatStretchModeChanged(ix, val) {
    const newValues = this.state.session.beatStretchModes.slice()
    if (ix === -1) {
      newValues.fill(newValues[0] ? 0 : 1)  
    } else {
      newValues[ix] = val ? 1 : 0
    }
    
    this.setState( (state, props) => {
      return {
        session: {
          ...state.session,
          beatStretchModes: newValues
        }
      }
    })
  }

  _onSelectedFxChanged(busType, slot, id) {
    this.setState((state, props) => {
      const v = Array.from(state.session.selectedEffects[busType])
      v.splice(slot, 1, id)
      ipcRenderer.send('setFx', {busType, ids: v})
      return {
        session: {
          ...state.session,
          selectedEffects: {
            ...state.session.selectedEffects,
            [busType]: v
          }
        }
      }
    })
  }

  _updateFileSelection(selection) {
    this.setState((state, props) => ({
      session: {
        ...state.session,
        fileSelection: selection
      }
    }))
  }

  _convertPatch() {
    const { scanDir: dir, beatStretchModes, songSections, selectedSongSections } = this.state.session
    ipcRenderer.send('convertPatch', {
      dir, 
      beatStretchModes,
      songSections: selectedSongSections.map( ss => ss.filter( s => songSections.map(sss => sss.name).includes(s) ) )
    })
  }

  _exportInformation(files) {
    const dir = this.state.session.scanDir
    const skuid = this.state.session.kitId

    ipcRenderer.send('export', {files, dir, skuid})
  }

  _hideDetailsModal() {
    this.setState((state, props) => ({
      session: {
        ...state.session,
        showDetailsModal: false,
        selectedFile: null
      }
    }))
  }

  _showEffectsModal(show = false) {
    this.setState((state, props) => ({
      session: {
        ...state.session,
        showEffectsModal: show
      }
    }))
  }

  _onSelectFile(file) {
    this.setState((state, props) => ({
      session: {
        ...state.session,
        showDetailsModal: true,
        selectedFile: file
      }
    }))
  }

  _getKitDirInfo(dir) {
    this.setState((state, props) => ({
      session: {
        ...state.session,
        scanning: true
      }
    }))
    ipcRenderer.send('kitDirInfo', {dir})
  }

  _onFilesDropped( e ) {
    e.stopPropagation()
    e.preventDefault()

    const files = e.dataTransfer.files
    const dir = files[0].path

    this.setState((state, props) => ({
      session: {
        ...state.session,
        scanDir: dir,
        files: [],
        samplesInDir: [],
        instFilePath: null,
        kitId: null,
        kitName: null,
        kitSubtitle: null,
        selectedFile: null,
        canConvertPatch: false,
        fileSelection: null,
        // beatStretchModes: new Array(400).fill(1),
        selectedSongSections: [],
      }
    }), () => {
      this._getKitDirInfo(dir)
    })

    return false
  }

}


export default App
