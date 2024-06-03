import React, { Component } from 'react'
import { Modal } from 'office-ui-fabric-react/lib/Modal'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

import { DefaultFontStyles, DefaultPalette } from '@uifabric/styling'
import Waveform from './Waveform'

import './FileDetailsModal.css'

const { superLarge } = DefaultFontStyles
const headerStyle = Object.assign({}, superLarge, {backgroundColor: DefaultPalette.themePrimary, color: DefaultPalette.white, padding: '3rem 3rem 1rem 2rem'})


export class FileDetailsModal extends Component {

    render() {

        return (
            <Modal
                isOpen={ this.props.show }
                onDismiss={ () => { this.props.onDismiss() } }
                isBlocking={ false }
                containerClassName='FileDetailsModal-container'
            >
                <div className='FileDetailsModal-header' style={headerStyle}>
                <span>Sample Details</span>
                </div>
                <div className='FileDetailsModal-body'>
                    <Waveform data={this.props.file.waveform} />
                    <TextField
                        label='Data'
                        value={ JSON.stringify(this.props.file, null, 2) }
                        disabled={ true }
                        multiline={ true }
                        rows={ 20 }
                    />
                </div>
            </Modal>
        )
    }
}