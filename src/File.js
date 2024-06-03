import React, { Component } from 'react'
import './File.css'

export class File extends Component {
    render() {
        const { file, onSelectFile } = this.props
        const { file: filePath, info } = file
        return (
            <li className="File" onClick={ (e) => {onSelectFile(filePath)} }>{info.path}</li>
        )
    }
}