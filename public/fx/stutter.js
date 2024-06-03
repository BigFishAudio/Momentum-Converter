const uigen = require('./uigen')

const fx = {
    module: 'EffectVocoder',
    name: 'Stutter',
    identifier: 'stutter',
    channels: false,
    slices: true,
    sliceSortId: 8,
    master: false,
    icon: 'Stutter',
    typeId: 22,
    snippet: null,
    sliceSnippet: {
        'Module': 'EffectVocoder',
        'Bypass': 'On',
        'Mix': 0.3,
        'Band Shape': 0
    },
    modulations: [
        {
            name: 'Stutter',
            dest: 'Stutter',
            identifier: 'stutter'
        }
    ],
    params: [
        {
            hidden: true,
            name: 'Bypass', //What is displayed to the User (Human readable)
            path: 'Bypass', //How the parameter is called in the Engine (name of the property on the effect) (Case sensitive, potentially contains whitespaces)
            identifier: 'bypass', //Name that the viewmodel is refering to (all lowercase, no whitespaces)
            type: 'int_switch',
            labels: {
                on: 'On',
                off: 'Off'
            },
            def: 1
        },
        {
            name: 'Stutter',
            path: 'Stutter',
            identifier: 'stutter',
            type: 'knob_round0',
            min: 0.0,
            max: 1,
            unit: '',
            def: 0.0,
            stepSize: 0.16666,
        },
    ],
    customParamSetter: (app, chIx, fxIx, paramId, val) => {
        switch (paramId) {
            case 'stutter': {
                break
            }
            case 'bypass': {
                app.otherInstrument.state['FX Busses'][chIx]['Effects'][fxIx]['Band Shape'] = val ? 0 : 1
                break
            }
        }
    },
    customParamGetter: (app, chIx, fxIx, paramId) => {
        switch (paramId) {
            case 'Stutter': // falls through
            case 'stutter': {
                return 0
            }
            case 'bypass': {
                return app.otherInstrument.state['FX Busses'][chIx]['Effects'][fxIx]['Band Shape'] ? false : true
            }
        }
    }
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden && !fx.modulations.map(m => m.identifier).includes(param.identifier)) )

module.exports = fx