import React from 'react'
import './Waveform.css'
import * as pako from 'pako'

class Waveform extends React.Component {
    render() {
        if (!this.props.data) {
            return (<div></div>)
        }
        const cnv = document.getElementById("waveformcanvas")
        const ctx = cnv.getContext("2d")
        ctx.canvas.width = 1000
        ctx.canvas.height = 255
        const decoded = window.atob(this.props.data)
        const uncompressed = pako.inflate(decoded)
        ctx.clearRect(0, 0, 1000, 255)
        ctx.fillStyle = "rgb(161, 159, 157)"
        for (let hi = 3, lo = 4, x = 0; lo < uncompressed.length; hi += 2, lo += 2, x++) {
            ctx.fillRect(x, 255 - uncompressed[hi], 1, uncompressed[hi] - uncompressed[lo])
        }

        // console.log(image)

        return (
            <div className="WaveformImage" style={{
                backgroundImage: `url(${cnv.toDataURL("image/png")})`
            }}></div>
        )
    }
}

export default Waveform