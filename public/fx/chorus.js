const uigen = require('./uigen')

const fx = {
    module: 'EffectChorus',
    name: 'Chorus',
    identifier: 'chorus',
    channels: true,
    channelSortId: 10,
    master: false,
    slices: true,
    sliceSortId: 10,
    icon: 'Chorus',
    typeId: 0,
    snippet: {
        "Module": "EffectChorus",
        'Bypass': 'Off',
    },
    sliceSnippet: {
        "Module": "EffectChorus",
        'Bypass': 'Off',
        "EffectMods": [
            {
                "Module": "EffectMod",
                "CC": 70,
                "Steps": [0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989],
                "Depth": 1.0,
                "Dest": "Mix"
            },
            {
                "Module": "EffectMod",
                "CC": 71,
                "Steps": [0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989],
                "Depth": 1.0,
                "Dest": "Rate"
            },
            {
                "Module": "EffectMod",
                "CC": 72,
                "Steps": [0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989],
                "Depth": 1.0,
                "Dest": "Depth"
            }
        ]
        },
    modulations: [
        {
            name: 'Mix',
            dest: 'Mix',
            identifier: 'mix'
        },
        {
            name: 'Rate',
            dest: 'Rate',
            identifier: 'rate'
        },
        {
            name: 'Depth',
            dest: 'Depth',
            identifier: 'depth'
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
            def: 0
        },
        {
            name: 'Rate',
            path: 'Rate',
            identifier: 'rate',
            type: 'knob_rate',
            min: 0.1,
            def: 0,
            max: 10.0,
            unit: 'Hz',
            stepSize: 0.1
        },
        {
            name: 'Depth',
            path: 'Depth',
            identifier: 'depth',
            type: 'knob_square',
            min: 0,
            def: 0,
            max: 32,
            unit: 'ms',
            stepSize: 0.1
        },
        {
            name: 'Damping',
            path: 'Damping',
            identifier: 'damping',
            type: 'knob_rate',
            min: 1,
            def: 1.0,
            max: 25,
            unit: 'kHz',
            stepSize: 0.1
        },
        {
            hidden: true,
            name: 'Delay',
            path: 'Delay',
            identifier: 'delay',
            type: 'knob_square',
            min: 0,
            def: 0.5,
            max: 32,
            unit: 'ms',
            stepSize: 0.1
        },
        {
            name: 'Voices',
            path: 'Voices',
            identifier: 'voices',
            type: 'int_round1',
            min: 1,
            def: 2,
            max: 4,
            unit: '',
            stepSize: 1
        },
        {
            hidden: true,
            name: 'Dry',
            path: 'Dry',
            identifier: 'dry',
            type: 'knob_volume',
            min: -100,
            def: 1,
            max: 0,
            unit: 'dB',
            stepSize: 0.1
        },
        {
            hidden: true,
            name: 'Wet',
            path: 'Wet',
            identifier: 'wet',
            type: 'knob_volume',
            min: -100,
            def: 0.89,
            max: 0,
            unit: 'dB',
            stepSize: 0.1
        },
        {
            name: 'Modulation',
            path: 'Modulation',
            identifier: 'modulation',
            type: 'int_select',
            min: 0,
            def: 0,
            max: 1,
            unit: '',
            items: ['Square', 'Sine']
        },
        {
            name: 'Mix',
            path: 'Mix',
            identifier: 'mix',
            type: 'knob_round0',
            min: 0,
            def: 0,
            max: 100,
            unit: '%',
            stepSize: 0.1
        }
    ],
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden && !fx.modulations.map(m => m.identifier).includes(param.identifier)) )

module.exports = fx