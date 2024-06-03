import React, { Component } from 'react'
import { Modal } from 'office-ui-fabric-react/lib/Modal'
import {
    ComboBox
} from 'office-ui-fabric-react/lib/index'

import { DefaultFontStyles, DefaultPalette } from '@uifabric/styling'

import './EffectsModal.css'

const { superLarge, medium } = DefaultFontStyles
const headerStyle = Object.assign({}, superLarge, {backgroundColor: DefaultPalette.themePrimary, color: DefaultPalette.white, padding: '3rem 3rem 1rem 2rem'})
const subHeaderStyle = Object.assign({}, medium, {color: DefaultPalette.black, padding: '3rem 3rem 1rem 0rem'})


export class EffectsModal extends Component {

    render() {

        const { effects, selectedEffects } = this.props

        const {
            group,
            slice,
            master
        } = effects

        const {
            group: selectedGroup,
            slice: selectedSlice,
            master: selectedMaster,
        } = selectedEffects

        const groupFx = group.map( fx => ({key: fx.id, text: fx.name}) )
        const sliceFx = slice.map( fx => ({key: fx.id, text: fx.name}) )
        const masterFx = master.map( fx => ({key: fx.id, text: fx.name}) )

        return (
            <Modal
                isOpen={ this.props.show }
                onDismiss={ () => { this.props.onDismiss() } }
                isBlocking={ false }
                containerClassName='EffectsModal-container'
            >
                <div className='EffectsModal-header' style={headerStyle}>
                    <span>Effects</span>
                </div>
                <div className='EffectsModal-body'>
                    <div className='EffectsModal-groupfx'>
                        <div style={subHeaderStyle}>
                            <span>Channels</span>
                        </div>
                        {
                            new Array(8).fill(0).map( (val, ix) => (
                                <ComboBox
                                    key={`groupfx-combo-${ix}`}
                                    selectedKey={selectedGroup[ix]}
                                    allowFreeform={false}
                                    autoComplete='off'
                                    options={groupFx}
                                    onChange={ (e, val) => this._onSelectedFxChanged('group', ix, val.key) }
                                />
                            ))
                        }
                    </div>
                    <div className='EffectsModal-slicefx'>
                        <div style={subHeaderStyle}>
                            <span>Slices</span>
                        </div>
                        {
                            new Array(8).fill(0).map( (val, ix) => (
                                <ComboBox
                                    key={`slicefx-combo-${ix}`}
                                    selectedKey={selectedSlice[ix]}
                                    allowFreeform={false}
                                    autoComplete='off'
                                    options={sliceFx}
                                    onChange={ (e, val) => this._onSelectedFxChanged('slice', ix, val.key) }
                                />
                            ))
                        }
                    </div>
                    <div className='EffectsModal-masterfx'>
                        <div style={subHeaderStyle}>
                            <span>Master</span>
                        </div>
                        {
                            new Array(8).fill(0).map( (val, ix) => (
                                <ComboBox
                                    key={`masterfx-combo-${ix}`}
                                    selectedKey={selectedMaster[ix]}
                                    allowFreeform={false}
                                    autoComplete='off'
                                    options={masterFx}
                                    onChange={ (e, val) => this._onSelectedFxChanged('master', ix, val.key) }
                                />
                            ))
                        }
                    </div>
                </div>
            </Modal>
        )
    }

    _onSelectedFxChanged(busType, slot, id) {
        this.props.onSelectedFxChanged(busType, slot, id)
    }
}