import * as React from 'react'
import './AppCommandBar.css'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'
import { ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu'
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner'

export class AppCommandBar extends React.Component {

  render() {
    
    const { 
      working = false,
      canConvertPatch,
      convertPatch,
      onExportSelection,
      canExport,
      showEffectsModal,
      // onScanMenu,
      // canScanMenu,
    } = this.props

    const menuItems = [
      {
        key: 'export',
        name: 'Export selection',
        onClick: () => { onExportSelection() },
        type: ContextualMenuItemType.Normal,
        disabled: !canExport,
        iconProps: {
          iconName: 'Save'
        }
      },
      // {
      //   key: 'scanmenu',
      //   name: 'Scan patch',
      //   onClick: () => { onScanMenu() },
      //   type: ContextualMenuItemType.Normal,
      //   disabled: !canScanMenu,
      //   iconProps: {
      //     iconName: 'Search'
      //   }
      // },
      {
        key: 'convert',
        name: 'Convert patch',
        onClick: () => { convertPatch() },
        type: ContextualMenuItemType.Normal,
        disabled: !canConvertPatch,
        iconProps: {
          iconName: 'MusicInCollectionFill'
        }
      },
      {
        key: 'effects',
        name: 'Configure FX',
        onClick: () => { showEffectsModal() },
        type: ContextualMenuItemType.Normal,
        iconProps: {
          iconName: 'Settings'
        }
      }
    ]

    const farItems = (working) ? [{
      key: 'spinner',
      name: 'spinner',
      onRender: () => <Spinner size={ SpinnerSize.large } />
    }] : []

    const overflowItems = []

    return (
      <div className="AppCommandBar">
        <CommandBar
          isSearchBoxVisible={ false }
          elipisisAriaLabel='More options'
          items={ menuItems }
          overflowItems={ overflowItems }
          farItems={ farItems }
        />
      </div>
    )
  }
}
