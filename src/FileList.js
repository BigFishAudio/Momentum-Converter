import React, { Component } from 'react'
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { List } from 'office-ui-fabric-react/lib/List'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'
import { IconButton, PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'
// import Waveform from './Waveform'


import './FileList.css'

export class FileList extends Component {

    constructor(props) {
        super(props)

        this._onColumnClick = this._onColumnClick.bind(this)
        this._onItemInvoked = this._onItemInvoked.bind(this)
        this._openSongSectionsDialog = this._openSongSectionsDialog.bind(this)
        this._closeSongSectionsDialog = this._closeSongSectionsDialog.bind(this)
        this._onRenderSongSectionItem = this._onRenderSongSectionItem.bind(this)
        this._addSongSectionValueChanged = this._addSongSectionValueChanged.bind(this)
        this._addSongSectionListValueChanged = this._addSongSectionListValueChanged.bind(this)
        this._onAddSongSection = this._onAddSongSection.bind(this)
        this._onAddSongSectionList = this._onAddSongSectionList.bind(this)
        this._onRenderSongSectionCell = this._onRenderSongSectionCell.bind(this)
    
        const _columns = [
            {
                key: 'path',
                name: 'Path',
                fieldName: 'fullPath',
                minWidth: 240,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                data: 'string',
                isPadded: true,
                onRender: (item, ix) => {
                  return <span className="ellipsisleft" style={!item.foundOnDisk ? {backgroundColor: 'rgba(255, 0, 0, 0.1)'} : {}}>&lrm;{`${item.displayPath}`}{!item.foundOnDisk ? <div>{`<not found>`}</div> : ''}</span>
                },
                className: "ellipsisleft"
            },
            {
              key: 'songSections',
              name: 'Song Sections',
              fieldName: 'songSections',
              minWidth: 300,
              isResizable: true,
              data: 'number',
              isPadded: true,
              onRender: this._onRenderSongSectionCell,
              onColumnClick: this._openSongSectionsDialog
            },
            {
              key: 'beatStretchMode',
              name: 'Playback Type',
              fieldName: 'beatStretchMode',
              minWidth: 100,
              isResizable: true,
              data: 'number',
              isPadded: true,
              onRender: (item, ix) => {
                  return <span>
                    <Toggle
                      onText={'Stretch'}
                      offText={'Beat'}
                      checked={this.props.beatStretchMode[ix] === 1}
                      onChange={ (e, val) => this.props.onBeatStretchModeChanged(ix, val) }
                    />
                  </span>
              },
              onColumnClick: () => {
                this.props.onBeatStretchModeChanged(-1)
              }
            },
            {
              key: 'tempo',
              name: 'Tempo (bpm)',
              minWidth: 60,
              isResizable: true,
              onColumnClick: this._onColumnClick,
              data: 'number',
              isPadded: true,
              onRender: (item) => {
                  return <span>{`${Math.round((item.beats / ((item.frames / item.sampleRate)/60)))}`}</span>
              },
            },
            {
              key: 'slices',
              name: 'Slices',
              fieldName: 'slices',
              minWidth: 35,
              isResizable: true,
              onColumnClick: this._onColumnClick,
              data: 'array',
              isPadded: true,
              onRender: (item) => {
                  return <span>{item.slices ? item.slices.length : 'none'}</span>
              },
            },
            {
              key: 'loopMode',
              name: 'Loop Mode',
              fieldName: 'loopMode',
              minWidth: 55,
              isResizable: true,
              onColumnClick: this._onColumnClick,
              data: 'string',
              isPadded: true
            },
            {
              key: 'rootKey',
              name: 'Root Key',
              fieldName: 'rootKey',
              minWidth: 35,
              isResizable: true,
              onColumnClick: this._onColumnClick,
              data: 'number',
              isPadded: true
            },
            {
                key: 'beats',
                name: 'Beats',
                fieldName: 'beats',
                minWidth: 45,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                data: 'number',
                isPadded: true
            },
            // {
            //     key: 'type',
            //     name: 'Type',
            //     fieldName: 'type',
            //     minWidth: 35,
            //     maxWidth: 90,
            //     isResizable: true,
            //     onColumnClick: this._onColumnClick,
            //     data: 'string',
            //     isPadded: true
            // },
            // {
            //   key: 'waveform',
            //   name: 'Waveform',
            //   fieldName: 'waveform',
            //   // data: 'string',
            //   onRender: item => <Waveform data={item.waveform} />
            // },
            {
                key: 'channels',
                name: 'Channels',
                fieldName: 'channels',
                minWidth: 35,
                maxWidth: 90,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                data: 'number',
                isPadded: true
            },            
            {
                key: 'length',
                name: 'Length (ms)',
                minWidth: 60,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                data: 'number',
                isPadded: true,
                onRender: (item) => {
                    return <span>{`${Math.round((item.frames / item.sampleRate) * 1000)}`}</span>
                },
            },
            {
                key: 'bits',
                name: 'Bit depth',
                fieldName: 'bits',
                minWidth: 35,
                maxWidth: 90,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                data: 'number',
                isPadded: true
            },
            {
                key: 'sampleRate',
                name: 'Sample Rate',
                fieldName: 'sampleRate',
                minWidth: 55,
                maxWidth: 90,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                data: 'number',
                isPadded: true
            },
            // {
            //     key: 'compressed',
            //     name: 'Compressed',
            //     fieldName: 'compressed',
            //     minWidth: 50,
            //     maxWidth: 90,
            //     isResizable: true,
            //     onColumnClick: this._onColumnClick,
            //     data: 'boolean',
            //     isPadded: true,
            //     onRender: (item) => {
            //         return <span>{item.bigEndian ? 'yes': 'no'}</span>
            //     },
            // },
            // {
            //     key: 'compression',
            //     name: 'Compression',
            //     fieldName: 'compression',
            //     minWidth: 55,
            //     maxWidth: 90,
            //     isResizable: true,
            //     onColumnClick: this._onColumnClick,
            //     data: 'string',
            //     isPadded: true,
            //     onRender: (item) => {
            //         return <span>{item.compression ? item.compression : 'none'}</span>
            //     },
            // },
            // {
            //     key: 'author',
            //     name: 'Author',
            //     fieldName: 'author',
            //     minWidth: 150,
            //     isResizable: true,
            //     onColumnClick: this._onColumnClick,
            //     data: 'string',
            //     isPadded: true
            // },
          {
                key: 'annotations',
                name: 'Annotations',
                fieldName: 'annotations',
                minWidth: 100,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                data: 'string',
                isPadded: true
            },
            // {
            //     key: 'copyright',
            //     name: 'Copyright',
            //     fieldName: 'copyright',
            //     minWidth: 35,
            //     maxWidth: 90,
            //     isResizable: true,
            //     onColumnClick: this._onColumnClick,
            //     data: 'string',
            //     isPadded: true
            // },
            {
                key: 'scaleType',
                name: 'Scale',
                fieldName: 'scaleType',
                minWidth: 50,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                data: 'string',
                isPadded: true
            },
            {
                key: 'timeSignatureNumerator',
                name: 'Beat',
                fieldName: 'timeSignatureNumerator',
                minWidth: 35,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                data: 'number',
                isPadded: true,
                onRender: (item) => {
                    return <span>{`${item.timeSignatureNumerator}/${item.timeSignatureDenominator}`}</span>
                },
            },
            {
                key: 'categories',
                name: 'Categories',
                fieldName: 'categories',
                minWidth: 150,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                data: 'array',
                isPadded: true,
                onRender: (item) => {
                    return <span>{item.categories ? item.categories.join(', ') : 'none'}</span>
                },
            },
            {
                key: 'audioDataLength',
                name: 'Audio Data',
                fieldName: 'audioDataLength',
                minWidth: 50,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                data: 'number',
                isPadded: true,
                onRender: (item) => {
                    return <span>{this._bytesToSize(item.audioDataLength)}</span>
                },
            },
            {
              key: 'frames',
              name: 'Frames',
              fieldName: 'frames',
              minWidth: 60,
              maxWidth: 90,
              isResizable: true,
              onColumnClick: this._onColumnClick,
              data: 'number',
              isPadded: true
          },
        ]
    
        this._selection = new Selection({
          onSelectionChanged: () => {
            this.setState({
              selectionDetails: this._getSelectionDetails(),
              isModalSelection: this._selection.isModal()
            })
            this.props.onSelectionChanged(this._selection.getSelection())
          }
        });
    
        this.state = {
          items: [],
          columns: _columns,
          selectionDetails: this._getSelectionDetails(),
          isModalSelection: this._selection.isModal(),
          isCompactMode: false,
          filterText: '',
          hideSongSectionsDialog: true,
          addSongSectionValue: '',
          addSongSectionListValue: '',
        }
      }

    render() {
        const { columns, isCompactMode, filterText, hideSongSectionsDialog, addSongSectionValue, addSongSectionListValue } = this.state
        const { files, songSections } = this.props
        const listItems = files.map( file => ({
            ...file.info,
            displayPath: file.file,
            foundOnDisk: !!file.info
        }))
        const listItemsFiltered = filterText ? listItems.filter(i => i.name.toLowerCase().indexOf(filterText) > -1) : listItems

        return (
            <div className="FileList">
                <Dialog
                    hidden={ hideSongSectionsDialog }
                    onDismiss={ this._closeSongSectionsDialog }
                    dialogContentProps={{
                      type: DialogType.normal,
                      title: 'Edit Song Sections',
                      subText: 'Add or remove song sections that can then be selected via the song section combo box on each row. Use the list text field to parse a list of comma separated song sections.'
                    }}
                    modalProps={{
                      isBlocking: false,
                      styles: { main: { maxWidth: 1280 } },
                    }}
                >
                  <List items={ songSections } onRenderCell={ this._onRenderSongSectionItem } />
                  <div style={{display: 'flex', 'alignItems': 'flex-end' }}>
                    <TextField label="Add Song Section" placeholder="Name" value={ addSongSectionValue } onChange={ this._addSongSectionValueChanged }/>
                    <PrimaryButton onClick={ this._onAddSongSection } text="Add" />
                  </div>
                  <div style={{display: 'flex', 'alignItems': 'flex-end' }}>
                    <TextField label="From List" placeholder="List" value={ addSongSectionListValue } onChange={ this._addSongSectionListValueChanged }/>
                    <PrimaryButton onClick={ this._onAddSongSectionList } text="Add" />
                  </div>
                  <DialogFooter>
                    <DefaultButton onClick={ this._closeSongSectionsDialog } text="Close" />
                  </DialogFooter>
                </Dialog>
                <MarqueeSelection selection={ this._selection }>
                <DetailsList
                    items={ listItemsFiltered }
                    compact={ isCompactMode }
                    columns={ columns }
                    selectionMode={ SelectionMode.multiple }
                    setKey="set"
                    layoutMode={ DetailsListLayoutMode.justified }
                    isHeaderVisible={ true }
                    selection={ this._selection }
                    selectionPreservedOnEmptyClick={ true }
                    onItemInvoked={ this._onItemInvoked }
                    enterModalSelectionOnTouch={ true }
                    ariaLabelForSelectionColumn="Toggle selection"
                    ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                />
                </MarqueeSelection>
            </div>
        )
    }

    componentDidUpdate(previousProps, previousState) {
        if (previousState.isModalSelection !== this.state.isModalSelection) {
          this._selection.setModal(this.state.isModalSelection)
        }
    }

    _onRenderSongSectionCell(item, ix) {
      return <Dropdown
        multiSelect={ true }
        allowFreeform={ false }
        autoComplete={ 'off' }
        options={ this.props.songSections.map( (songSection) => ({
          key: songSection.name,
          text: songSection.name
        }) ) }
        selectedKeys={ this.props.selectedSongSections[ix] }
        onChange={ (e, option, selIx) => {this.props.onSongSectionSelected(ix, option, selIx) } }
      />
    }

    _onAddSongSection() {
      if (this.state.addSongSectionValue.trim().length > 0) {
        this.props.onAddSongSection(this.state.addSongSectionValue.trim())
        this.setState({ addSongSectionValue: '' })
      }
    }

    _onAddSongSectionList() {
      if (this.state.addSongSectionListValue.trim().length > 0) {
        const items = this.state.addSongSectionListValue.split(',')
        for (let item of items) {
          this.props.onAddSongSection(item.trim())
        }
        this.setState({ addSongSectionListValue: '' })
      }
    }

    _onRemoveSongSection(ix) {
      this.props.onRemoveSongSection(ix)
    }

    _addSongSectionValueChanged(e, value) {
      this.setState({ addSongSectionValue: value })
    }

    _addSongSectionListValueChanged(e, value) {
      this.setState({ addSongSectionListValue: value })
    }

    _onRenderSongSectionItem(item, index) {
      return (
        <div style={{display: 'flex', 'alignItems': 'center'}}>
          <div>{item.name}</div>
          <IconButton iconProps={{ iconName: 'Delete' }} onClick={ () => this._onRemoveSongSection(index) } />
        </div>
      )
    }

    _openSongSectionsDialog() {
      this.setState({ hideSongSectionsDialog: false })
    }
    _closeSongSectionsDialog() {
      this.setState({ hideSongSectionsDialog: true })
    }

    _bytesToSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0 Byte'
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
    }
  
    _onChangeCompactMode(ev, checked) {
      this.setState({ isCompactMode: checked })
    }
  
    _onChangeModalSelection(ev, checked) {
      this.setState({ isModalSelection: checked })
    }
  
    _onChangeText(ev, text) {
      this.setState((state, props) => ({
        filterText: text
      }))
    }
  
    _onItemInvoked(item) {
      this.props.onItemInvoked(item)
    }
  
    _getSelectionDetails() {
      const selectionCount = this._selection.getSelectedCount()
  
      switch (selectionCount) {
        case 0:
          return 'No items selected';
        case 1:
          return '1 item selected: ' + (this._selection.getSelection()[0]).name
        default:
          return `${selectionCount} items selected`
      }
    }
  
    _onColumnClick(ev, column) {
      const { columns, items } = this.state
      let newItems = items.slice()
      const newColumns = columns.slice()
      const currColumn = newColumns.filter((currCol, idx) => {
        return column.key === currCol.key
      })[0]
      newColumns.forEach((newCol) => {
        if (newCol === currColumn) {
          currColumn.isSortedDescending = !currColumn.isSortedDescending
          currColumn.isSorted = true
        } else {
          newCol.isSorted = false
          newCol.isSortedDescending = true
        }
      })
      newItems = this._sortItems(newItems, currColumn.fieldName || '', currColumn.isSortedDescending)
      this.setState({
        columns: newColumns,
        items: newItems
      })
    }
  
    _sortItems(items, sortBy, descending = false) {
      if (descending) {
        return items.sort((a, b) => {
          if (a[sortBy] < b[sortBy]) {
            return 1
          }
          if (a[sortBy] > b[sortBy]) {
            return -1
          }
          return 0
        });
      } else {
        return items.sort((a, b) => {
          if (a[sortBy] < b[sortBy]) {
            return -1
          }
          if (a[sortBy] > b[sortBy]) {
            return 1
          }
          return 0
        })
      }
    }
}