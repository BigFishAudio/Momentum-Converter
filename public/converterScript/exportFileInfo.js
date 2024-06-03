const path = require('path')
const crypto = require('crypto')

const instruments = [
                    'Bass', 'Drums', 'Guitars', 'Horn/Wind', 'Keyboards', 'Mallets', 'Mixed', 'Other Instrument', 
                    'Percussion', 'Sound Effect', 'Strings', 'Texture/Atmosphere', 'Vocals', 'Accordion', 
                    'Acoustic Bass', 'Acoustic Guitar', 'Ambience', 'Animals', 'Bagpipe', 'Banjo', 'Bassoon', 
                    'Bell', 'Bongo', 'Celesta', 'Cello', 'Chime', 'Choir', 'Clarinet', 'Clave', 'Clavinet', 
                    'Conga', 'Cowbell', 'Cymbal', 'Double Bass', 'Drum Kit', 'Electric Bass', 'Electric Guitar', 
                    'Electric Piano', 'Electronic Beats', 'English Horn', 'Explosions', 'Female', 'Flute', 
                    'Foley', 'French Horn', 'Gong', 'Harmonica', 'Harp', 'Harpsichord', 'Hi-hat', 
                    'Impacts & Crashes', 'Kalimba', 'Kick', 'Koto', 'Male', 'Mandolin', 'Marimba', 'Mech/Tech', 
                    'Mics.', 'Motions & Transitions', 'Oboe', 'Organ', 'Pan Flute', 'Pedal Steel Guitar', 'People', 
                    'Piano', 'Piccolo', 'Rattler', 'Recorder', 'Saxophone', 'Sci-Fi', 'Shaker', 'Sitar', 
                    'Slide Guitar', 'Snare', 'Sports & Leisure', 'Steel Drum', 'Synthesizer', 'Synthetic Bass', 
                    'Tambourine', 'Timpani', 'Tom', 'Transportation', 'Trombone', 'Trumpet', 'Tuba', 'Vibraphone', 
                    'Vinyl/Scratch', 'Viola', 'Violin', 'Weapons', 'Work/Home', 'Xylophone',
                ]

const descriptors = [
                    'Single', 'Ensemble', 'Part', 'Fill', 'Acoustic', 'Electric', 'Dry', 'Processed', 'Clean', 
                    'Distorted', 'Cheerful', 'Dark', 'Relaxed', 'Intense', 'Grooving', 'Arrhythmic', 
                    'Melodic', 'Dissonant',
                ]

function lookupCategory(category) {
    if (instruments.some(instrument => instrument.toLowerCase() === category.toLowerCase())) {
        return 'instrument'
    } else if (descriptors.some(descriptor => descriptor.toLowerCase() === category.toLowerCase())) {
        return 'descriptor'
    } else {
        return 'style'
    }
}

function annotateFileInfo(file, dir, skuid) {

    // filesFiltered.map( file => ({
    //     sampleid: crypto.createHash('sha256').update(file.path).digest('hex'),
    //     samplename: path.basename(file.path),
    //     applelooptags: {
    //       style: file.categories,
    //       bpm: file.beats,
    //       key: file.rootKey
    //     }
    //   }))

    const samplePath = path.relative(dir, file.fullPath)
    const sampleid = crypto.createHash('sha256').update(samplePath).digest('hex')
    const skusampleid = crypto.createHash('sha256').update(`${skuid} ${file.fileName}`).digest('hex')

    const instrumentTags = file.categories.filter( category => lookupCategory(category) === 'instrument' )
    const descriptorTags = file.categories.filter( category => lookupCategory(category) === 'descriptor' )
    const styleTags = file.categories.filter( category => lookupCategory(category) === 'style' )
    const lengthInSec = file.frames / file.sampleRate
    const lengthInMilliSec = Math.round((file.frames / file.sampleRate) * 1000)
    const tempo = Math.round((file.beats / (lengthInSec/60)))

    return {
        sampleid,
        skusampleid,
        samplename: file.fileName,
        applelooptags: {
            style: styleTags,
            instruments: instrumentTags,
            descriptors: descriptorTags,
            annotation: file.annotations,
            playbacktype: file.loopMode,
            key: file.rootKey,
            scale: file.scaleType,
            beats: file.beats,
            metordenominator: file.timeSignatureDenominator,
            metornumerator: file.timeSignatureNumerator,
            comments: file.copyright
        },
        samplerate: file.sampleRate,
        bitdepth: file.bits,
        channels: file.channels,
        length: lengthInMilliSec,
        filesize: file.dataLength,
        tempo,
        waveformpreview: file.waveform
    }
}

module.exports = { annotateFileInfo }