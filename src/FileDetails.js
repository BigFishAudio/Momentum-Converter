import React, { Component } from 'react'
import './FileDetails.css'

export class FileDetails extends Component {
    render() {
        const { file } = this.props
        const { file: filePath, info } = file
        return (
            <div>
            {file && 
                Object.getOwnPropertyNames(info).map( (key, ix) => <div key={`prop${ix}`}>{key}: {info[key]}</div>)
            }
            </div>
        )
    }
}