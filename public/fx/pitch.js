const uigen = require('./uigen')

const fx = {
    module: 'EffectVocoder',
    name: 'Pitch',
    identifier: 'pitch',
    channels: false,
    slices: true,
    sliceSortId: 7,
    master: false,
    icon: 'Pitch',
    typeId: 23,
    snippet: null,
    sliceSnippet: {
        'Module': 'EffectVocoder',
        'Bypass': 'On',
        'Mix': 0.2,
        'Band Shape': 0
    },
    modulations: [
        {
            name: 'Pitch',
            dest: 'Pitch',
            identifier: 'pitch'
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
            name: 'Pitch',
            path: 'Pitch',
            identifier: 'pitch',
            type: 'knob_round0',
            min: 0.0,
            max: 1,
            unit: 'ct',
            def: 0.0,
            stepSize: 0.01,
        },
    ],
    customParamSetter: (app, chIx, fxIx, paramId, val) => {
        switch (paramId) {
            case 'Pitch':  /* falls through */
            case 'pitch': {
                app.otherInstrument.state['FX Busses'][chIx]['Effects'][fxIx]['Resonance'] = val
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
            case 'Pitch': /* falls through */
            case 'pitch': {
                return app.otherInstrument.state['FX Busses'][chIx]['Effects'][fxIx]['Resonance']
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