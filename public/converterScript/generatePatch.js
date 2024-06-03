const path = require('path')
const fs = require('fs-extra')
const gzipSync = require('zlib').gzipSync

const { getTemplateFxBusses, getSelectedFxIdentifiers } = require('./effectHandler')
const { AppleLoopInfo, AudioFileInfoReader } = require('../AppleLoopInfo')


const kitKeys = ['C0', 'C#0', 'Db0', 'D0', 'D#0', 'Eb0', 'E0', 'F0', 'F#0', 'Gb0', 'G0', 'G#0', 'Ab0', 'A0', 'A#0', 'Bb0', 'B0', 'C1', 'C#1', 'Db1', 'D1', 'D#1', 'Eb1', 'E1', 'F1', 'F#1', 'Gb1', 'G1', 'G#1', 'Ab1', 'A1', 'A#1', 'Bb1', 'B1', 'C0', 'C#0', 'Db0', 'D0', 'D#0', 'Eb0', 'E0', 'F0', 'F#0', 'Gb0', 'G0', 'G#0', 'Ab0', 'A0', 'A#0', 'Bb0', 'B0', 'C1', 'C#1', 'Db1', 'D1', 'D#1', 'Eb1', 'E1', 'F1', 'F#1', 'Gb1', 'G1', 'G#1', 'Ab1', 'A1', 'A#1', 'Bb1', 'B1', 'NONE']

const TEMPLATE_GROUP = require('./templateGroup')
const EXPECTED_NUMBER_OF_CHANNELS = 40
const EXPECTED_NUMBER_OF_FX_PER_CHANNEL_BUS = 16
const EXPECTED_NUMBER_OF_FX_PER_MASTER_BUS = 8
const KEYS_TO_MAINTAIN = [
    // 'Groups', 
    // 'Mappings', 
    // 'FX Busses', 
    'loops',
    'effects',
    'pluginConfig',
    // 'FXSliceData1',
    // 'FXSliceData2',
    // 'FXSliceData3',
    // 'FXSliceData4',
    // 'FXSliceData5',
    // 'FXSliceData6',
    // 'FXSliceData7',
    // 'FXSliceData8',
    // 'FXSliceData9',
    // 'FXSliceData10',
    // 'FXSliceData11',
    // 'FXSliceData12',
    // 'FXSliceData13',
    // 'FXSliceData14',
    // 'FXSliceData15',
    // 'FXSliceData16',
    // 'FXSliceData17',
    // 'FXSliceData18',
    // 'FXSliceData19',
    // 'FXSliceData20',
    // 'FXSliceData21',
    // 'FXSliceData22',
    // 'FXSliceData23',
    // 'FXSliceData24',
    // 'FXSliceData25',
    // 'FXSliceData26',
    // 'FXSliceData27',
    // 'FXSliceData28',
    // 'FXSliceData29',
    // 'FXSliceData30',
    // 'FXSliceData31',
    // 'FXSliceData32',
    // 'FXSliceData33',
    // 'FXSliceData34',
    // 'FXSliceData35',
    // 'FXSliceData36',
    // 'FXSliceData37',
    // 'FXSliceData38',
    // 'FXSliceData39',
    // 'FXSliceData40',
    'Sample_Playback'
]

function contentPackPathForSample(kitDir, samplePath) {
    const extName = path.extname(samplePath)
    if (['aiff', 'aif', 'wav', 'wave'].includes(extName.toLowerCase())) {
        throw new Error(`Mapped sample "${samplePath}" has an unsupported extions. Use either of ['aiff', 'aif', 'wav', 'wave'].`)
    }

    const dirName = path.dirname(samplePath)
    const samplesDir = path.basename(dirName)
    if (samplesDir !== 'Samples') {
        throw new Error(`Mapped sample "${samplePath}" is not in a "Samples" sub directory. This is disallowed by convention.`)
    }

    const maybeIdPath = path.resolve(kitDir, dirName, '..', 'ID.json')
    try {
        fs.accessSync(maybeIdPath)
    } catch (err) {
        throw new Error(`Could not find ID.json for mapped sample "${samplePath}": ${err.toString()}`)
    }

    let kitId = null

    try {
        const idContents = fs.readFileSync(maybeIdPath)
        const idParsed = JSON.parse(idContents)
        if (!idParsed || !idParsed.length || !idParsed[0]['skuid'] || !idParsed[0]['skuid'].length) {
            throw new Error('No skuid found in the given ID.json')
        }
        kitId = idParsed[0]['skuid']
    } catch (err) {
        throw new Error(`Could not read the skuid from the given ID.json: ${err.toString()}`)
    }

    return `>\n${kitId}\n/Samples/${path.basename(samplePath)}`
}

function canConvertPatch(dir) {
    return new Promise((resolve, reject) => {
        let KIT_ID = null
        /* parse ID.json or fail hard if not possible */
        const idPath = path.resolve(dir, 'ID.json')
        try {
            fs.accessSync(idPath)
        } catch (err) {
            reject(new Error(`Didn’t find an ID.json file in the given path: ${idPath}`))
            return
        }
        try {
            const idContents = fs.readFileSync(idPath)
            const idParsed = JSON.parse(idContents)
            if (!idParsed || !idParsed.length || !idParsed[0]['skuid'] || !idParsed[0]['skuid'].length) {
                throw new Error('No skuid found in the given ID.json')
            }
            KIT_ID = idParsed[0]['skuid']
        } catch (err) {
            reject(new Error(`Could not read the skuid from the given ID.json: ${err.toString()}`))
            return
        }


        /* find one *.inst file or fail if there are none or more than one */
        const filesInKitDir = fs.readdirSync(dir, { withFileTypes: true })
        const instFiles = filesInKitDir.filter(dirent => dirent.isFile() && path.extname(dirent.name) === '.inst')
        if (!instFiles.length) {
            reject(new Error('Didn’t find an instrument file in the given kit directiory.'))
            return
        }
        if (!instFiles.length > 1) {
            reject(new Error('Found more than one instrument files in the given kit directory. Aborting.'))
            return
        }


        /* test if there is a "Samples" dir */
        /* Dont test for Samples dir because menu patches may not have one */
        // const samplesDir = filesInKitDir.filter( dirent => dirent.isDirectory() && dirent.name === 'Samples' )
        // if (!samplesDir.length) {
        //     reject(new Error('Didn’t find a Samples folder in the given kit directory.'))
        //     return
        // }


        /* read the *.inst file */
        INST_FILE_NAME = instFiles[0].name
        const editorInstPath = path.resolve(dir, INST_FILE_NAME)
        let editorInstStr = null
        try {
            editorInstStr = fs.readFileSync(editorInstPath)
        } catch (err) {
            reject(new Error(`Could not read editor inst file: ${err.toString()}`))
            return
        }

        let editorInst = null
        try {
            editorInst = JSON.parse(editorInstStr)
        } catch (err) {
            reject(new Error(`Could not parse editor inst file: ${err.toString()}`))
            return
        }

        resolve(true)
    })
}

module.exports = {
    convertPatch(userDataPath, PATH_TO_KIT, eventcb, beatStretchModes = new Int32Array(400).fill(1), songSections = []) {
        return new Promise((resolve, reject) => {

            let KIT_ID = null
            let INST_FILE_NAME = null

            /* parse ID.json or fail hard if not possible */
            const idPath = path.resolve(PATH_TO_KIT, 'ID.json')
            try {
                fs.accessSync(idPath)
            } catch (err) {
                reject(new Error(`Didn’t find an ID.json file in the given path: ${idPath}`))
                return
            }
            try {
                const idContents = fs.readFileSync(idPath)
                const idParsed = JSON.parse(idContents)
                if (!idParsed || !idParsed.length || !idParsed[0]['skuid'] || !idParsed[0]['skuid'].length) {
                    throw new Error('No skuid found in the given ID.json')
                }
                KIT_ID = idParsed[0]['skuid']
            } catch (err) {
                reject(new Error(`Could not read the SKUID from the given ID.json: ${err.toString()}`))
                return
            }


            /* find one *.inst file or fail if there are none or more than one */
            const filesInKitDir = fs.readdirSync(PATH_TO_KIT, { withFileTypes: true })
            const instFiles = filesInKitDir.filter(dirent => dirent.isFile() && path.extname(dirent.name) === '.inst')
            if (!instFiles.length) {
                reject(new Error('Didn’t find an instrument file in the given kit directory.'))
                return
            }
            if (!instFiles.length > 1) {
                reject(new Error('Found more than one instrument files in the given kit directory. Aborting.'))
                return
            }


            /* test if there is a "Samples" dir */
            const samplesDir = filesInKitDir.filter(dirent => dirent.isDirectory() && dirent.name === 'Samples')
            if (!samplesDir.length) {
                reject(new Error('Didn’t find a Samples folder in the given kit directory.'))
                return
            }


            /* read the *.inst file */
            INST_FILE_NAME = instFiles[0].name
            const editorInstPath = path.resolve(PATH_TO_KIT, INST_FILE_NAME)
            let editorInstStr = null
            try {
                editorInstStr = fs.readFileSync(editorInstPath)
            } catch (err) {
                reject(new Error(`Could not read editor inst file: ${err.toString()}`))
                return
            }


            let editorInst = null
            try {
                editorInst = JSON.parse(editorInstStr)
            } catch (err) {
                reject(new Error(`Could not parse editor inst file: ${err.toString()}`))
                return
            }


            /* read Script Defines */
            const sdefs = editorInst['Script Defines']
            if (!sdefs) {
                eventcb({ type: 'warn', message: 'No Script Defines were found in the kit. Using defaults.' })
                editorInst['pluginConfig'] = {
                    kitKey: 'C0',
                    kitKeyConfigurable: true,
                    kitKeyActive: true
                }
            } else {
                const sdefsSplit = sdefs.split(' ')
                const pluginConfig = {}
                for (let sdef of sdefsSplit) {
                    try {
                        const sdefParsed = JSON.parse(sdef)
                        Object.assign(pluginConfig, sdefParsed)
                    } catch (err) {
                        eventcb({ type: 'warn', message: `Didn’t apply script define "${sdef}" to plugin config because it was no valid JSON.` })
                    }
                }
                if (typeof pluginConfig.kitKey === 'undefined') {
                    eventcb({ type: 'warn', message: `kitKey is undefined. Defaulting to 'NONE'` })
                    pluginConfig.kitKey = 'NONE'
                }
                if (kitKeys.indexOf(pluginConfig.kitKey) === -1) {
                    eventcb({ type: 'warn', message: `kitKey is "${pluginConfig.kitKey}" is not allowed. Use one of these instead: ${kitKeys.join()}. Defaulting to "NONE"` })
                    pluginConfig.kitKey = 'NONE'
                }
                if (typeof pluginConfig.kitKeyConfigurable === 'undefined') {
                    eventcb({ type: 'warn', message: `kitKeyConfigurable is undefined. Defaulting to true` })
                    pluginConfig.kitKeyConfigurable = true
                }
                if (typeof pluginConfig.scaleType === 'undefined') {
                    eventcb({ type: 'warn', message: `scaleType is undefined. Defaulting to "major"` })
                    pluginConfig.scaleType = 'maj'
                }
                pluginConfig.kitKeyActive = pluginConfig.kitKey !== 'NONE'
                editorInst['pluginConfig'] = pluginConfig
            }


            /* setup groups */
            if (!Array.isArray(editorInst['Groups'])) {
                eventcb({ type: 'warn', message: `Found no groups in the kit. Creating empty array.` })
                editorInst['Groups'] = new Array()
            }


            const groups = editorInst['Groups']
            for (let i = 0; i < EXPECTED_NUMBER_OF_CHANNELS; i++) {
                if (groups[i]) {
                    if (!groups[i]['Name']) {
                        groups[i]['Name'] = `Ch ${i + 1}`
                    }
                    groups[i]['Output'] = (i + 1) * (-1)
                    groups[i]['ModSources'] = TEMPLATE_GROUP['ModSources']
                    groups[i]['ModRoutings'] = TEMPLATE_GROUP['ModRoutings']
                    groups[i]['Filters'] = TEMPLATE_GROUP['Filters']
                } else {
                    groups[i] = Object.assign({}, TEMPLATE_GROUP, {
                        ['Name']: `Ch ${i + 1}`,
                        ['Output']: (i + 1) * (-1)
                    })
                }
            }

            const {
                busses: TEMPLATE_FX_BUSSES,
                modulations
            } = getTemplateFxBusses(userDataPath)

            /* setup fx busses */
            if (!editorInst['FX Busses'] || !editorInst['FX Busses'].length) {
                editorInst['FX Busses'] = TEMPLATE_FX_BUSSES
            }

            for (let fxBus of editorInst['FX Busses']) {
                if (fxBus['Name'].includes('Ch FX') && !fxBus['Name'].includes('Sends') && fxBus['Effects'].length !== EXPECTED_NUMBER_OF_FX_PER_CHANNEL_BUS) {
                    reject(new Error(`Channel effect bus "${fxBus['Name']}" does not contain ${EXPECTED_NUMBER_OF_FX_PER_CHANNEL_BUS} effects`))
                    return
                }
                if (fxBus['Name'].includes('Master') && fxBus['Effects'].length !== EXPECTED_NUMBER_OF_FX_PER_MASTER_BUS) {
                    reject(new Error(`Master effect bus "${fxBus['Name']}" does not contain ${EXPECTED_NUMBER_OF_FX_PER_MASTER_BUS} effects`))
                    return
                }
            }

            const effects = getSelectedFxIdentifiers(userDataPath)

            editorInst['effects'] = effects

            // add modulations
            Object.assign(editorInst, modulations)

            const loops = []
            let songSectionIx = 0
            /* patch sample paths for all groups */
            for (let group of editorInst['Groups']) {
                if (!Array.isArray(group['Zones'])) {
                    continue
                }
                const convertedGroup = {}
                convertedGroup['Name'] = group['Name']
                convertedGroup['Zones'] = []
                for (let zone of group['Zones']) {
                    const samplePath = zone['Sample']
                    const contentPackPath = contentPackPathForSample(PATH_TO_KIT, samplePath)
                    zone['Sample'] = contentPackPath
                    // Is an ORed mask: SetRoot=1, SetTune=2, SetKey=4, SetVel=8, SetLoop=16, SetEnd=32, SetSlices=64, remove SetRoot, SetKey, SetVel if we are setting the key range (and the root note to the same key as the key range)
                    zone['Set From Sample'] = 114
                    zone['songSections'] = songSections[songSectionIx]
                    convertedGroup['Zones'].push(zone)
                    songSectionIx++
                }
                loops.push(convertedGroup)
            }

            editorInst['loops'] = loops

            editorInst['Sample_Playback'] = Array.from(beatStretchModes)

            /* delete all keys that we dont want to carry over to the patch */
            for (const key in editorInst) {
                if (!KEYS_TO_MAINTAIN.includes(key)) {
                    delete editorInst[key]
                }
            }

            editorInst['conversionToolVersion'] = global.version

            /* serialise and write the converted patch to file */
            let editorInstSerialised = null
            try {
                if (process.env.ENVIRONMENT === 'dev') {
                    editorInstSerialised = JSON.stringify(editorInst, null, 2)
                } else {
                    editorInstSerialised = JSON.stringify(editorInst)
                }
            } catch (err) {
                reject(new Error(`Could not serialise editor inst file: ${err.toString()}`))
                return
            }

            const outputDir = path.resolve(PATH_TO_KIT, 'converted')

            try {
                fs.mkdirSync(outputDir)
            } catch (err) {
                if (err && err.code && err.code === 'EEXIST') {
                    eventcb({ type: 'info', message: `Did not create 'converted' directory because it existed already.` })
                } else {
                    reject(new Error(`Could not created 'converted' directory. ${err.toString()}`))
                }
            }

            const convertedInstFilePath = path.resolve(outputDir, `converted_${INST_FILE_NAME}.gz`)
            try {
                const instBuffer = Buffer.from(editorInstSerialised)
                fs.writeFileSync(
                    convertedInstFilePath, gzipSync(instBuffer)
                )
            } catch (err) {
                reject(new Error(`Could not write converted inst file: ${err.toString()}`))
                return
            }

            resolve(convertedInstFilePath)
        })
    },

    async kitDirInfo(dir) {
        const ret = {
            instFilePath: null,
            kitId: null,
            kitName: "",
            kitSubtitle: "",
            mappedSamples: [],
            samplesInDir: [],
            canConvertPatch: false,
            errors: []
        }
        try {
            const canConvert = await canConvertPatch(dir)
            ret.canConvertPatch = canConvert
        } catch (err) {
            ret.canConvertPatch = false
            console.error(err)
        }

        const filesInKitDir = await fs.readdir(dir, { withFileTypes: true })
        const instFiles = filesInKitDir.filter(dirent => dirent.isFile() && path.extname(dirent.name) === '.inst')

        if (!instFiles.length) {
            ret.errors.push(new Error(`No *.inst file found in dir "${dir}"`).toString())
            return ret
        }
        
        if (!instFiles.length > 1) {
            ret.errors.push(new Error(`More than one *.inst file found in dir "${dir}"`).toString())
            return ret
        }


        const instFile = instFiles[0]
        const instFilePath = path.join(dir, instFile.name)

        let inst

        try {
            const content = await fs.readFile(instFilePath)
            inst = JSON.parse(content)
        } catch (err) {
            ret.errors.push(new Error(`Failed to parse *.inst file "${instFilePath}". ${err.toString()}`).toString())
            return ret
        }

        ret.instFilePath = instFilePath

        const list = []

        for (let group of inst['Groups']) {
            for (let zone of group['Zones']) {
                list.push(
                    path.resolve(dir, zone['Sample'])
                )
            }
        }

        const fileInfos = []

        for (let file of list) {
            try {
                const info = await new AppleLoopInfo(file)
                fileInfos.push({
                    file,
                    info
                })
            } catch (err) {
                console.error(err)
                fileInfos.push({
                    file,
                    info: null
                })
                ret.errors.push(new Error(`Failed to create file info for file "${file}": ${err.toString()}`).toString())
            }
        }

        ret.mappedSamples = fileInfos

        const idPath = path.resolve(dir, 'ID.json')
        try {
            fs.accessSync(idPath)
        } catch (err) {
            ret.errors.push(new Error(`Failed to access ID.json at "${idPath}". ${err.toString()}`).toString())
        }

        let idContents = null

        try {
            idContents = fs.readFileSync(idPath)
        } catch (err) {
            ret.errors.push(new Error(`Failed to read ID.json at "${idPath}". ${err.toString()}`).toString())
        }

        let idParsed = null
        try {
            idParsed = JSON.parse(idContents)
        } catch (err) {
            ret.errors.push(new Error(`Failed to parse ID.json at "${idPath}". ${err.toString()}`).toString())
        }

        if (!idParsed || !idParsed.length || !idParsed[0]['skuid'] || !idParsed[0]['skuid'].length) {
            ret.errors.push(new Error(`ID.json at "${idPath}" did not contain a skuid.`).toString())
        }
        
        ret.kitId = idParsed[0]['skuid']
        ret.kitName = idParsed[0]['skuname']
        ret.kitSubtitle = idParsed[0]['subtitle']

        const samplesInDir = await new Promise( async (resolve, reject) => {
            const afir = new AudioFileInfoReader(dir)
            afir.on('error', err => ret.errors.push(err.toString()))
            afir.on('finish', ({files}) => resolve(files))
            afir.process()
        })

        ret.samplesInDir = samplesInDir

        return ret
    },
}