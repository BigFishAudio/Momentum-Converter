const uigen = require('./uigen')

const fx = {
    module: 'EffectFilter',
    name: 'State Variable Filter',
    identifier: 'statevariablefilter',
    channels: true,
    channelSortId: 17,
    master: true,
    masterSortId: 9,
    slices: false,
    icon: 'StateVarFilter',
    snippet: {
        'Module': 'EffectFilter',
        'Mode': 'SVF',
        'Bypass': 'Off',
    },
    sliceSnippet: null,
    modulations: [],
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
            def: 0
        },
        {
            name: 'Cutoff',
            path: 'Cutoff',
            identifier: 'cutoff',
            type: 'knob_rate',
            min: 20,
            max: 25000,
            unit: 'Hz',
            def: 0.549,
            stepSize: 1,
        },
        {
            name: 'Resonance',
            path: 'Resonance',
            identifier: 'resonance',
            type: 'knob_round0',
            min: 0,
            max: 100,
            unit: '%',
            def: 0,
            stepSize: 0.1
        },
        {
            name: 'Low/High',
            path: 'SVF Low/High',
            identifier: 'svflowhigh',
            type: 'knob_round0',
            min: -100,
            max: 100,
            unit: '%',
            def: 0,
            stepSize: 0.1
        },
        {
            name: 'Notch/Peak',
            path: 'SVF Notch/Peak',
            identifier: 'svfnotchpeak',
            type: 'knob_round0',
            min: 0,
            max: 100,
            unit: '%',
            def: 1,
            stepSize: 0.1
        },
    ]
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden && !fx.modulations.map(m => m.identifier).includes(param.identifier)) )

module.exports = fx