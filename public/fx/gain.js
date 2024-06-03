const uigen = require('./uigen')

const fx = {
    module: 'EffectPan',
    name: 'Gain',
    identifier: 'gain',
    channels: true,
    channelSortId: 8,
    slices: false,
    master: true,
    masterSortId: 2,
    icon: 'Gain',
    typeId: 20,
    snippet: {
        "Module": "EffectPan",
        "Width": 0.6667
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
            name: 'Gain',
            path: 'Gain',
            identifier: 'gain',
            type: 'knob_volume',
            min: -100,
            max: 12.04,
            unit: 'dB',
            def: 0.629960525,
            stepSize: 0.05,
        },
        {
            name: 'Invert Phase',
            path: 'Invert Phase',
            identifier: 'invertphase',
            type: 'int_select',
            min: 0,
            max: 3,
            unit: '',
            def: 0,
            items: ['Off', 'On', 'Left Only', 'Right Only']
        },
    ]
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden && !fx.modulations.map(m => m.identifier).includes(param.identifier)) )

module.exports = fx