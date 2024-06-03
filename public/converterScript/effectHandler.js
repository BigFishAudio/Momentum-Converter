const GE_VERSION = global.version.split('.').map( s => Number.parseInt(s) ).reduce( (cur, prev, ix) => prev+Math.pow(10, ix)*cur, 0 )

console.log(GE_VERSION)

const fx = require('../fx')
const fs = require('fs')
const path = require('path')

const fxForModules = require('../fx/snowflakeHandler')
const fxParamSettings = require('./effects.json')

function rangetrans(X, A, B, C, D) {
    return ((X - A) * ((D - C) / (B - A))) + C
}

function scaledNormalise(param, value) {
    const minValue = param.min
    const maxValue = param.max
    if (param.type === 'knob_volume' && value < minValue) {
        return 0
    }
    switch(param.type)
    {
      case 'knob_square': //square law
        if(minValue >= 0)
        {
          return (value <= minValue)? 0.0 : ((value >= maxValue)? 1.0 : Math.sqrt((value - minValue) / (maxValue - minValue)))
        }
        else
        {
          let min = -Math.sqrt(Math.abs(minValue))
          value = (value >= 0.0) ? Math.sqrt(value) : -Math.sqrt(-value)
          return (value - min) / (Math.sqrt(maxValue) - min)
        }

      case 'knob_volume': //cube-law dB
        return (value >= maxValue) ? 1.0 : Math.pow(10.0, (value - maxValue) * 0.05 / 3.0)
      
      case 'knob_lingain': //gain factor displayed in dB
        return (value >= maxValue) ? 1.0 : 0.5 + 0.5 * Math.pow(10.0, (value - maxValue) * 0.05)

      case 'knob_pan': //100L to 100R
        break

      case 'knob_time': //zero, then exponential sec to max
        if(value <= minValue)
          return (value <= 0.0) ? 0.0 : 0.01 * value / minValue
        else if(value >= maxValue)
          return 1.0
        else
          return 0.01 + 0.99 * Math.log(value / minValue) / Math.log(maxValue / minValue)

      case 'knob_rate': //exponential Hz to max
        return (value <= minValue) ? 0.0 : ((value >= maxValue)? 1.0 : Math.log(value / minValue) / Math.log(maxValue / minValue))

    //   case 'knob_ratio': //-min:100 to 100:max
        // value = ((value < 0.0) ? minValue : maxValue) - value
        // break

      case 'int_switch':
          return value
          
      case 'int_select':
          return value

      default: //linear between min and max
        break
    }

    return (value <= minValue) ? 0.0 : ((value >= maxValue) ? 1.0 : (value - minValue) / (maxValue - minValue))
}

/* get the overridden default values from effects.json */
function defaultValue(effect, param, isSliceFx = false) {
    const settings = fxParamSettings.effects.find( f => f.name === effect.name )
    if (!settings) {
        console.log('return def')
        return param.def
    }
    const paramDef = settings.parameters.find( p => p.name === param.name )
    if (!paramDef) {
        console.log('return def')
        return param.def
    }
    return scaledNormalise(param, (isSliceFx && (paramDef.centerline || paramDef.centerline === 0)) ? paramDef.centerline : paramDef.default)
}

function modulationsForFx(fx, parameterIx) {

    let ret = new Float64Array(128).fill(0)

    if (parameterIx >= fx.modulations.length) {
        return ret
    }

    const param = fx.params.find( p => p.path === fx.modulations[parameterIx].dest )

    if (!param) {
        console.log('returning empty. not good')
        return ret
    }

    const effectSettings = fxParamSettings.effects.find( f => f.name === fx.name )

    if (!effectSettings) {
        console.log('returning empty. not good')
        return ret
    }

    const modParam = effectSettings.parameters.find( p => p.name === param.name )

    if (!modParam) {
        console.log('returning empty. not good')
        return ret
    }

    const modVal = modParam.modulation / 100

    ret.fill(modVal)

    return ret
}

function _setModulationValuesNormalised({effect, parameter, zone, values, target}) {
    const valuesMapped = values.map( value => rangetrans((0.5 + Math.SQRT1_2 * Math.sign(value-0.5) * Math.sqrt(Math.abs(value-0.5))), 0, 1, -1000000, 1000000) )
    const valuesToSet = new Int32Array(128)
    valuesToSet.set(valuesMapped, 0)
    target.set(valuesToSet, (effect*3*128*10 + zone*3*128 + parameter*128))
}

function _moduleForId(id, slice) {
    const mod = fx.find( f => f.identifier === id )
    const snippet = Object.assign( 
        {}, 
        (slice ? mod.sliceSnippet : mod.snippet), 
        {Bypass: 'On'}, 
        mod.params.filter(p => p.identifier !== 'bypass').reduce( 
            (prev, cur) => Object.assign(prev, { [cur.path]: defaultValue(mod, cur, slice) }), 
        {})
    )
    return snippet
}

function getSelectedGroupFx(userDataPath) {
    const {busses} = getTemplateFxBusses(userDataPath)
    return busses[0].Effects.filter( (fx, ix) => ix > 7 ).map( fx => fxForModules(fx).identifier )
}

function getSelectedSliceFx(userDataPath) {
    const {busses} = getTemplateFxBusses(userDataPath)
    return busses[0].Effects.filter( (fx, ix) => ix < 8 ).map( fx => fxForModules(fx).identifier )
}

function getSelectedMasterFx(userDataPath) {
    const {busses} = getTemplateFxBusses(userDataPath)
    return busses[86].Effects.map( fx => fxForModules(fx).identifier )
}

function getGroupFx() {
    return fx.filter( fx => fx.channels ).map( fx => ({id: fx.identifier, name: fx.name}) )
}

function getSliceFx() {
    return fx.filter( fx => fx.slices ).map( fx => ({id: fx.identifier, name: fx.name}) )
}

function getMasterFx() {
    return fx.filter( fx => fx.master ).map( fx => ({id: fx.identifier, name: fx.name}) )
}

function getSelectedFxIdentifiers(userDataPath) {
    return {
        slice: getSelectedSliceFx(userDataPath),
        group: getSelectedGroupFx(userDataPath),
        master: getSelectedMasterFx(userDataPath),
    }
}

function setGroupFx(userDataPath, fxIds) {
    const modules = fxIds.map( id => _moduleForId(id, false) )
    const {busses} = getTemplateFxBusses(userDataPath)
    for (let i = 0; i < 40; i++) {
        _setFxAtSlot(modules, busses[i], 8)
    }
    _writeTemplateFxBusses(busses, userDataPath)
}

function setSliceFx(userDataPath, fxIds) {
    const modules = fxIds.map( id => _moduleForId(id, true) )
    const {busses} = getTemplateFxBusses(userDataPath)
    for (let i = 0; i < 40; i++) {
        _setFxAtSlot(modules, busses[i], 0)
    }
    _writeTemplateFxBusses(busses, userDataPath)
}

function setMasterFx(userDataPath, fxIds) {
    const modules = fxIds.map( id => _moduleForId(id, false) )
    const {busses} = getTemplateFxBusses(userDataPath)
    _setFxAtSlot(modules, busses[86], 0)
    _writeTemplateFxBusses(busses, userDataPath)
}

function _setFxAtSlot(fx, bus, slot) {
    bus['Effects'].splice(slot, fx.length, ...fx)
}

function getTemplateFxBusses(userDataPath) {
    const templateFxBussesPath = path.resolve(userDataPath, 'templateFxBusses.json')
    let templateFxBusses = null
    if (fs.existsSync(templateFxBussesPath)) {
        const raw = fs.readFileSync(templateFxBussesPath)
        templateFxBusses = JSON.parse(raw)
        const updatedVersion = (!('GE_VERSION' in templateFxBusses)) || templateFxBusses['GE_VERSION'] < GE_VERSION
        if (!updatedVersion) {
            return {
                busses: templateFxBusses['busses'],
                modulations: templateFxBusses['modulations']
            }
        }
    }
    templateFxBusses = require('./templateFxBusses.json')
    fs.writeFileSync(templateFxBussesPath, JSON.stringify(templateFxBusses))
    return {
        busses: templateFxBusses['busses'],
        modulations: templateFxBusses['modulations']
    }
}

function _writeTemplateFxBusses(fxBusses, userDataPath) {

    let modulations = new Array(40).fill(0).map( a => new Int32Array(30720) )

    for (let cix = 0; cix < 40; cix++) {
        for (let eix = 0; eix < 8; eix++) {
            for (let pix = 0; pix < 3; pix++) {
                const fx = fxForModules(fxBusses[cix]['Effects'][eix])
                const values = modulationsForFx(fx, pix)
                for (let zix = 0; zix < 10; zix++) {
                    _setModulationValuesNormalised({effect: eix, parameter: pix, zone: zix, values, target: modulations[cix]})
                }
            }
        }
    }
    
    modulations = modulations.reduce( (prev, cur, ix) => Object.assign(prev, {
        [`FXSliceData${ix+1}`]: Array.from(cur)
    }), {})

    const templateFxBussesPath = path.resolve(userDataPath, 'templateFxBusses.json')
    const raw = JSON.stringify({
        GE_VERSION,
        busses: fxBusses,
        modulations
    })
    fs.writeFileSync(templateFxBussesPath, raw)
}

module.exports = {
    fxForModules,
    _moduleForId,
    _setFxAtSlot,
    _writeTemplateFxBusses,
    getGroupFx,
    getSliceFx,
    getMasterFx,
    getSelectedFxIdentifiers,
    setGroupFx,
    setSliceFx,
    setMasterFx,
    getSelectedGroupFx,
    getSelectedSliceFx,
    getSelectedMasterFx,
    getTemplateFxBusses,
    _setModulationValuesNormalised,
    modulationsForFx,
    GE_VERSION
}