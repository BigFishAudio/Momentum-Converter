const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const zlib = require('zlib')
const EventEmitter = require('events')
const WaveformRenderer = require('./deps/a.out.js');
WaveformRenderer.api = new Promise( (resolve, reject) => {
    WaveformRenderer.onRuntimeInitialized = async _ => {
      // Create wrapper functions for all the exported C functions
      const api = {
        create_buffer: WaveformRenderer.cwrap('create_buffer', 'number', ['number', 'number']),
        destroy_buffer: WaveformRenderer.cwrap('destroy_buffer', '', ['number']),
        free_result: WaveformRenderer.cwrap('free_result', '', ['number']),
        get_result_pointer: WaveformRenderer.cwrap('get_result_pointer', 'number', []),
        get_result_size: WaveformRenderer.cwrap('get_result_size', 'number', []),
        get_waveform_overview: WaveformRenderer.cwrap('get_waveform_overview', '', ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'])
      }

      WaveformRenderer.api = api

      resolve({api})
    }
})

const chunkResolvers = {
  'FORM': function (buf, pos, bigEndian) {
    const infoPart = {}
    let didReadChunk = false
    let nextPos = pos

    if ('FORM' === buf.toString('utf8', pos, pos + 4) && 'AIFF' === buf.toString('utf8', pos + 8, pos + 12)) {
      infoPart.type = 'aiff'
      infoPart.bigEndian = true
      infoPart.dataLength = AppleLoopInfo.read32(buf, pos + 4, bigEndian)
      didReadChunk = true
      nextPos = pos + 12
      return {
        infoPart,
        didReadChunk,
        nextPos
      }
    } else {
      return {
        didReadChunk: false,
        error: new Error(`Didn't find "FORM" and "AIFF" field.`)
      }
    }
  },

  'MARK': function (buf, pos, bigEndian) {
    const infoPart = {}
    let didReadChunk = false
    let nextPos = pos

    if ('MARK' === buf.toString('utf8', pos, pos + 4)) {
      infoPart.hasMarkerChunk = true
      infoPart.markerChunkLength = AppleLoopInfo.read32(buf, pos + 4, bigEndian)
      didReadChunk = true
      nextPos = pos + 4 + infoPart.markerChunkLength
      return {
        infoPart,
        didReadChunk,
        nextPos
      }
    } else {
      return {
        didReadChunk: false,
        error: new Error(`Invalid "MARK" chunk.`)
      }
    }
  },

  'COMM': function (buf, pos, bigEndian) {
    const infoPart = {}
    let didReadChunk = false
    let nextPos = pos

    if ('COMM' === buf.toString('utf8', pos, pos + 4)) {
      const commFieldLength = AppleLoopInfo.read32(buf, pos + 4, bigEndian)

      if (commFieldLength < 18) {
        return {
          didReadChunk: false,
          error: new Error(`Expected AIIF standard "COMM" field to have a size greater than 17 bytes.`)
        }
      }

      infoPart.commFieldLength = commFieldLength

      const commFieldData = buf.slice(pos + 4 + 4, pos + 4 + 4 + commFieldLength)

      const channels = AppleLoopInfo.read16(commFieldData, 0, bigEndian)
      infoPart.channels = channels

      const frames = AppleLoopInfo.read32(commFieldData, 2, bigEndian)
      infoPart.frames = frames

      const bits = AppleLoopInfo.read16(commFieldData, 6, bigEndian)
      infoPart.bits = bits

      let sampleRate = ((commFieldData[10] << 16) + (commFieldData[11] << 8) + commFieldData[12])
      sampleRate *= (1 << commFieldData[9]) / (1 << 22)
      infoPart.sampleRate = sampleRate

      if (commFieldLength >= 22) {
        infoPart.compressed = true
        const compression = commFieldData.slice(18, 22).toString()
        infoPart.compression = compression
      } else {
        infoPart.compressed = false
        infoPart.compression = null
      }

      didReadChunk = true
      nextPos = pos + 4 + commFieldLength
      return {
        infoPart,
        didReadChunk,
        nextPos
      }
    } else {
      return {
        didReadChunk: false,
        error: new Error(`Expected a "COMM" field but didn't finde one.`)
      }
    }
  },

  'AUTH': function (buf, pos, bigEndian) {
    const infoPart = {}
    let didReadChunk = false
    let nextPos = pos

    if ('AUTH' === buf.toString('utf8', pos, pos + 4)) {
      const authFieldLength = AppleLoopInfo.read32(buf, pos + 4, bigEndian)

      infoPart.authFieldLength = authFieldLength
      infoPart.author = buf.toString('utf8', pos + 4 + 4, pos + 4 + 4 + authFieldLength)

      didReadChunk = true
      nextPos = pos + 4 + authFieldLength
      return {
        infoPart,
        didReadChunk,
        nextPos
      }
    } else {
      return {
        didReadChunk: false,
        error: new Error(`Expected an "AUTH" field but didn't finde one.`)
      }
    }
  },

  'ANNO': function (buf, pos, bigEndian) {
    const infoPart = {}
    let didReadChunk = false
    let nextPos = pos

    if ('ANNO' === buf.toString('utf8', pos, pos + 4)) {
      const annoFieldLength = AppleLoopInfo.read32(buf, pos + 4, bigEndian)

      infoPart.annoFieldLength = annoFieldLength
      infoPart.annotations = buf.toString('utf8', pos + 4 + 4, pos + 4 + 4 + annoFieldLength)

      didReadChunk = true
      nextPos = pos + 4 + annoFieldLength
      return {
        infoPart,
        didReadChunk,
        nextPos
      }
    } else {
      return {
        didReadChunk: false,
        error: new Error(`Expected an "ANNO" field but didn't finde one.`)
      }
    }
  },

  '(c) ': function (buf, pos, bigEndian) {
    const infoPart = {}
    let didReadChunk = false
    let nextPos = pos

    if ('(c) ' === buf.toString('utf8', pos, pos + 4)) {
      const copyrightFieldLength = AppleLoopInfo.read32(buf, pos + 4, bigEndian)

      infoPart.copyrightFieldLength = copyrightFieldLength
      infoPart.copyright = buf.toString('utf8', pos + 4 + 4, pos + 4 + 4 + copyrightFieldLength)

      didReadChunk = true
      nextPos = pos + 4 + copyrightFieldLength
      return {
        infoPart,
        didReadChunk,
        nextPos
      }
    } else {
      return {
        didReadChunk: false,
        error: new Error(`Expected a copyright field but didn't finde one.`)
      }
    }
  },

  'basc': function (buf, pos, bigEndian) {
    const infoPart = {}
    let didReadChunk = false
    let nextPos = pos

    if ('basc' === buf.toString('utf8', pos, pos + 4)) {
      const bascFieldLength = AppleLoopInfo.read32(buf, pos + 4, bigEndian)

      if (bascFieldLength !== 84) {
        return {
          didReadChunk: false,
          error: new Error(`Expected the "basc" fields size to be 84 bytes but got ${bascFieldLength}.`)
        }
      }

      infoPart.bascFieldLength = bascFieldLength
      infoPart.aiffVersion = AppleLoopInfo.read32(buf, pos + 4 + 4, bigEndian)
      infoPart.beats = AppleLoopInfo.read32(buf, pos + 4 + 4 + 4, bigEndian)
      infoPart.rootKey = AppleLoopInfo.read16(buf, pos + 4 + 4 + 4 + 4, bigEndian)
      infoPart.scale = AppleLoopInfo.read16(buf, pos + 4 + 4 + 4 + 4 + 2, bigEndian)

      switch (infoPart.scale) {
        case 1: // minor
          infoPart.scaleType = 'minor'
          break
        case 2: // major
          infoPart.scaleType = 'major'
          break
        case 3: // neither
          infoPart.scaleType = 'neither'
          break
        case 4: // both
          infoPart.scaleType = 'both'
          break
        default: // unkown
          infoPart.scaleType = 'unknown'
          break
      }

      infoPart.timeSignatureNumerator = AppleLoopInfo.read16(buf, pos + 4 + 4 + 4 + 4 + 2 + 2, bigEndian)
      infoPart.timeSignatureDenominator = AppleLoopInfo.read16(buf, pos + 4 + 4 + 4 + 4 + 2 + 2 + 2, bigEndian)
      infoPart.loopType = AppleLoopInfo.read16(buf, pos + 4 + 4 + 4 + 4 + 2 + 2 + 2 + 2, bigEndian)

      switch (infoPart.loopType) {
        case 0: // one shot
          infoPart.loopMode = 'oneshot'
          break
        case 1: // loop
          infoPart.loopMode = 'loop'
          break
        default: //unkown
          infoPart.loopMode = 'unknown'
          break;
      }

      didReadChunk = true
      nextPos = pos + 4 + bascFieldLength
      return {
        infoPart,
        didReadChunk,
        nextPos
      }
    } else {
      return {
        didReadChunk: false,
        error: new Error(`Expected a "basc" field but didn't finde one.`)
      }
    }
  },

  'cate': function (buf, pos, bigEndian) {
    const infoPart = {}
    let didReadChunk = false
    let nextPos = pos

    if ('cate' === buf.toString('utf8', pos, pos + 4)) {
      const cateFieldLength = AppleLoopInfo.read32(buf, pos + 4, bigEndian)

      if (cateFieldLength < 100) {
        return {
          didReadChunk: false,
          error: new Error(`Expected the "cate" field to have a size greater 100 bytes.`)
        }
      }

      infoPart.categoryFieldLength = cateFieldLength

      const categories = []
      const ofUnknownUseButOneIsGood = AppleLoopInfo.read32(buf, pos + 4 + 4, bigEndian)

      if (ofUnknownUseButOneIsGood !== 1) {
        return {
          didReadChunk: false,
          error: new Error(`Expected a "1" in cetgory field got ${ofUnknownUseButOneIsGood}.`)
        }
      }

      const emtpyBuffer50 = Buffer.alloc(50, 0)
      const emtpyBuffer18 = Buffer.alloc(18, 0)

      let category = null
      // let nextCategory = null

      for (let cix = pos + 12; cix + 40 <= (pos + cateFieldLength); cix += 50) {
        category = buf.slice(cix, cix + 50)
        // nextCategory = buf.slice(cix+50, cix+100)
        if (category.equals(emtpyBuffer50)) {
          if ((!buf.slice(cix + 50, cix + 50 + 18).equals(emtpyBuffer18)) && (buf.indexOf(0, cix + 50) === cix + 50) && (buf[cix + 50 + 17] !== 0)) {
            cix += 18
          }
        } else {
          let categoryEnd = cix + 50
          const maybeCategoryEnd = buf.indexOf(0, cix)
          if (maybeCategoryEnd > cix && maybeCategoryEnd < categoryEnd) {
            categoryEnd = maybeCategoryEnd
          }

          categories.push(buf.toString('utf8', cix, categoryEnd))
        }
      }
      infoPart.categories = categories
      didReadChunk = true
      nextPos = pos + 4 + cateFieldLength
      return {
        infoPart,
        didReadChunk,
        nextPos
      }
    } else {
      return {
        didReadChunk: false,
        error: new Error(`Expected a "cate" field but didn't finde one.`)
      }
    }
  },

  'trns': function (buf, pos, bigEndian) {
    const infoPart = {}
    let didReadChunk = false
    let nextPos = pos

    if ('trns' === buf.toString('utf8', pos, pos + 4)) {
      const trnsFieldLength = AppleLoopInfo.read32(buf, pos + 4, bigEndian)


      if (trnsFieldLength < 1) {
        return {
          didReadChunk: false,
          error: new Error(`Expected the "trns" field to have a size greater 1 bytes.`)
        }
      }

      infoPart.slicesFieldLength = trnsFieldLength

      const slices = []

      for (let six = pos + 4 + 4 + 100; six < (pos + 4 + trnsFieldLength); six += 24) {
        const transient = buf.slice(six, six + 24)
        if (65536 !== AppleLoopInfo.read32(transient, 0, bigEndian)) {
          continue
        }
        slices.push(AppleLoopInfo.read32(transient, 4, bigEndian))
      }

      infoPart.slices = slices
      didReadChunk = true
      nextPos = pos + 4 + trnsFieldLength
      return {
        infoPart,
        didReadChunk,
        nextPos
      }
    } else {
      return {
        didReadChunk: false,
        error: new Error(`Expected a "trns" field but didn't finde one.`)
      }
    }
  },

  'FLLR': function (buf, pos, bigEndian) {
    const infoPart = {}
    let didReadChunk = false
    let nextPos = pos

    if ('FLLR' === buf.toString('utf8', pos, pos + 4)) {
      const fllrFieldLength = AppleLoopInfo.read32(buf, pos + 4, bigEndian)
      didReadChunk = true
      nextPos = pos + 4 + fllrFieldLength
      return {
        infoPart,
        didReadChunk,
        nextPos
      }
    } else {
      return {
        didReadChunk: false,
        error: new Error(`Expected a "FLLR" field but didn't finde one.`)
      }
    }
  },

  'SSND': function (buf, pos, bigEndian) {
    const infoPart = {}
    let didReadChunk = false
    let nextPos = pos

    if ('SSND' === buf.toString('utf8', pos, pos + 4)) {
      const ssndFieldLength = AppleLoopInfo.read32(buf, pos + 4, bigEndian)
      const audioStartOffset = AppleLoopInfo.read32(buf, pos + 8, bigEndian)
      const audioBlockSize = AppleLoopInfo.read32(buf, pos + 12, bigEndian)


      infoPart.audioDataLength = ssndFieldLength - 8
      infoPart.audioStartOffset = audioStartOffset
      infoPart.audioBlockSize = audioBlockSize
      infoPart.audioDataStart = pos + 16 + audioStartOffset

      didReadChunk = true
      nextPos = pos + 4 + ssndFieldLength
      return {
        infoPart,
        didReadChunk,
        nextPos
      }
    } else {
      return {
        didReadChunk: false,
        error: new Error(`Expected a "SSND" field but didn't finde one.`)
      }
    }
  },
}

class AppleLoopInfo {
  constructor(path, options = {
    waveform: {
      points: 1000, 
      startZoom: 0.0, 
      endZoom: 1.0, 
      vertZoom: 0.0, 
      compress: true
    }
  }) {
    this.path = path
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.process(options)
        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
  }

  static readChunk(buf, pos, bigEndian = true) {
    const chunkType = buf.toString('utf8', pos, pos + 4)
    if (chunkType in chunkResolvers) {
      return chunkResolvers[chunkType](buf, pos, bigEndian)
    } else {
      return {
        didReadChunk: false
      }
    }
  }

  static read32(buffer, offest = 0, bigEndian = true) {
    if (bigEndian) {
      return buffer.readInt32BE(offest)
    } else {
      return buffer.readInt32LE(offest)
    }
  }

  static read16(buffer, offest = 0, bigEndian = true) {
    if (bigEndian) {
      return buffer.readInt16BE(offest)
    } else {
      return buffer.readInt16LE(offest)
    }
  }

  static async renderWaveform(fileInfo, data, options) {
    const api = await WaveformRenderer.api
    const { points, startZoom, endZoom, vertZoom, compress } = options
    const frames = fileInfo.frames
    const channels = fileInfo.channels
    const bits = fileInfo.bigEndian ? fileInfo.bits * -1 : fileInfo.bits

    const audioData = new Uint8Array(data.slice(fileInfo.audioDataStart, fileInfo.audioDataLength))
    const size = audioData.byteLength
    const p = api.create_buffer(size);
    WaveformRenderer.HEAP8.set(audioData, p);
    api.get_waveform_overview(points, startZoom, endZoom, vertZoom, p, frames, bits, channels)
    const resultPointer = api.get_result_pointer();
    const resultSize = api.get_result_size();
    const resultView = new Uint8Array(WaveformRenderer.HEAP8.buffer, resultPointer, resultSize);
    const result = new Uint8Array(resultView);
    api.free_result(resultPointer);
    api.destroy_buffer(p);

    if (compress) {
      const compressed = await new Promise( (resolve, reject) => {
        zlib.gzip(result.buffer, (err, c) => {
          resolve(c)
        })
      })
      return compressed.toString('base64')
    } else {
      return Buffer.from(result.buffer).toString('base64')
    }
  }

  process(options) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, async (err, buf) => {
        if (err) {
          reject(err)
        } else {
          try {
            const data = await this.readData(buf)
            data.fileName = path.basename(this.path)
            data.fullPath = this.path
            data.sha256 = crypto.createHash('sha256').update(buf).digest('hex')
            data.waveform = await AppleLoopInfo.renderWaveform(data, buf, options.waveform)
            resolve(data)
          } catch (err) {
            reject(err)
          }
        }
      })
    })
  }

  async readData(buf) {
    const info = {}
    let size = null
    if (44 > (size = Buffer.byteLength(buf))) {
      throw new Error(`Expected a file with size larger than 44 bytes.`)
    }

    let pos = 0
    let bigEndian = true

    const {
      nextPos,
      infoPart,
      didReadChunk,
      error: err
    } = AppleLoopInfo.readChunk(buf, pos, bigEndian)

    if (err) {
      console.error(err)
    }

    if (didReadChunk) {
      Object.assign(info, infoPart)
      pos = nextPos
      bigEndian = info.bigEndian
    } else {
      throw new Error(`Could not read the initial file chunk.`)
    }

    while (pos < size) {
      const {
        nextPos,
        infoPart,
        didReadChunk
      } = AppleLoopInfo.readChunk(buf, pos, bigEndian)
      if (didReadChunk) {
        Object.assign(info, infoPart)
        pos = nextPos
      } else {
        pos += 4
      }
    }

    return info
  }

}

class AudioFileInfoReader extends EventEmitter {
  constructor(dir) {
    super()
    this.dir = dir
    this.progress = -1
    this.nfiles = -1
    this.processed = 0
    this.files = []
  }

  _findAudioFiles(dir, recursive = false) {
    console.log(`Looking for files in ${dir}`)
    return new Promise((resolve, reject) => {
      const supportedFileTypes = ['.aif', '.aiff']
      fs.readdir(dir, {
        withFileTypes: true
      }, async (err, dirents) => {
        if (err) {
          console.error(err)
          resolve([])
          return
        }
        if (recursive) {
          const files = dirents.filter(dirent => dirent.isFile && supportedFileTypes.includes(path.extname(dirent.name))).map(dirent => path.join(dir, dirent.name))
          const childFilePromises = dirents.filter(dirent => dirent.isDirectory()).map(dirent => this._findAudioFiles(path.join(dir, dirent.name), true))
          const childFiles = await Promise.all(childFilePromises)
          resolve(files.concat(...childFiles))
        } else {
          const files = dirents.filter(dirent => dirent.isFile && supportedFileTypes.includes(path.extname(dirent.name))).map(dirent => path.join(dir, dirent.name))
          resolve(files)
        }
      })
    })
  }

  _progress(file) {
    this.processed++
    // console.log(this.processed)
    this.progress = this.processed / this.nfiles

    this.emit('progress', {progress: this.progress, file})

    if (this.progress === 1) {
      this._finish()
    }
  }

  _finish() {
    this.emit('finish', {files: this.files})
  }

  _error(file) {
    this.emit('error', {file})
  }

  process() {
    const dir = this.dir
    this._findAudioFiles(dir, true)
      .then(async files => {
        this.nfiles = files.length

        if (!files.length) {
          this._finish()
          return
        }

        console.log(`Starting to process ${this.nfiles} files.`);

        this.files = []
        for (let file of files) {
          try {
            const info = await new AppleLoopInfo(file)
            this.files.push({
              file,
              info
            })
            this._progress(file)
          } catch (err) {
            this._progress(file)
            this._error(file)
          }
        }
      })
    }
}

module.exports = {
    AppleLoopInfo,
    AudioFileInfoReader
}