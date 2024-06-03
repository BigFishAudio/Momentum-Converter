const uigen = require('./uigen')

const fx = {
    module: 'EffectVocoder',
    name: 'Glide',
    identifier: 'glide',
    channels: false,
    slices: true,
    sliceSortId: 6,
    master: false,
    icon: 'PitchGlide',
    typeId: 24,
    snippet: null,
    sliceSnippet: {
        'Module': 'EffectVocoder',
        'Bypass': 'On',
        'Mix': 0.1
    },
    modulations: [
        {
            name: 'Amount',
            dest: 'Amount',
            identifier: 'amount'
        },
        {
            name: 'Speed',
            dest: 'Speed',
            identifier: 'speed'
        },
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
            name: 'Amount',
            path: 'Amount',
            identifier: 'amount',
            type: 'knob_round0',
            min: 0.0,
            max: 1,
            unit: '',
            def: 0.5,
            stepSize: 0.01,
        },
        {
            name: 'Speed',
            path: 'Speed',
            identifier: 'speed',
            type: 'knob_round0',
            min: 0,
            max: 4,
            unit: 's',
            def: 0,
            stepSize: 0.01,
        },
    ],
    customParamSetter: (app, chIx, fxIx, paramId, val) => {
        switch (paramId) {
            case 'amount': {
                const vals = Float64Array.from(app.otherInstrument.state['Groups'][chIx]['ModSources'][0]['Curve'])
                vals[6] = val
                app.otherInstrument.state['Groups'][chIx]['ModSources'][0]['Curve'] = vals
                break
            }
            case 'speed': {
                const vals = Float64Array.from(app.otherInstrument.state['Groups'][chIx]['ModSources'][0]['Curve'])
                vals[4] = val
                app.otherInstrument.state['Groups'][chIx]['ModSources'][0]['Curve'] = vals
                break
            }
            case 'bypass': {
                app.otherInstrument.state['Groups'][chIx]['ModRoutings'][0]['Active'] = val ? 0 : 1
                app.otherInstrument.state['Groups'][chIx]['ModRoutings'][1]['Active'] = val ? 0 : 1
                break
            }
        }
    },
    customParamGetter: (app, chIx, fxIx, paramId) => {
        switch (paramId) {
            case 'amount': {
                return Float64Array.from(app.otherInstrument.state['Groups'][chIx]['ModSources'][0]['Curve'])[6]
            }
            case 'speed': {
                return Float64Array.from(app.otherInstrument.state['Groups'][chIx]['ModSources'][0]['Curve'])[4]
            }
            case 'bypass': {
                return app.otherInstrument.state['Groups'][chIx]['ModRoutings'][0]['Active'] ? false : true
            }
        }
    }
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden && !fx.modulations.map(m => m.identifier).includes(param.identifier)) )

module.exports = fx