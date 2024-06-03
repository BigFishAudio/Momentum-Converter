const uigen = require('./uigen')

const fx = {
    module: 'EffectLoFi',
    name: 'LoFi',
    identifier: 'lofi',
    channels: true,
    channelSortId: 14,
    master: true,
    masterSortId: 7,
    slices: true,
    sliceSortId: 15,
    icon: 'LoFi',
    typeId: 11,
    snippet: {
        "Module": "EffectLoFi",
        'Bypass': 'Off',
    },
    sliceSnippet: {
        "Module": "EffectLoFi",
        'Bypass': 'Off',
        "EffectMods": [
          {
            "Module": "EffectMod",
            "CC": 70,
            "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
            "Depth": 1.0,
            "Dest": "Mix"
          },
          {
            "Module": "EffectMod",
            "CC": 71,
            "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
            "Depth": 1.0,
            "Dest": "Sample Rate"
          },
          {
            "Module": "EffectMod",
            "CC": 72,
            "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
            "Depth": 1.0,
            "Dest": "Bit Depth"
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
            name: 'Sample Rate',
            dest: 'Sample Rate',
            identifier: 'samplerate'
        },
        {
            name: 'Bit Depth',
            dest: 'Bit Depth',
            identifier: 'bitdepth'
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
            name: 'Sample Rate',
            path: 'Sample Rate',
            identifier: 'samplerate',
            type: 'knob_rate',
            min: 2,
            max: 50,
            unit: 'kHz',
            def: 1,
            stepSize: 0.1,
        },
        {
            name: 'Jitter',
            path: 'Jitter',
            identifier: 'jitter',
            type: 'knob_round0',
            min: 0,
            max: 50,
            unit: '%',
            def: 0,
            stepSize: 0.1
        },
        {
            name: 'Bit Depth',
            path: 'Bit Depth',
            identifier: 'bitdepth',
            type: 'knob_round1',
            min: 2,
            max: 16,
            unit: '',
            def: 1.0,
            stepSize: 1
        },
        {
            name: 'Bit Bias',
            path: 'Bit Bias',
            identifier: 'bitbias',
            type: 'knob_round0',
            min: 0,
            max: 100,
            unit: '%',
            def: 0,
            stepSize: 0.1
        },
        {
            name: 'Slew Rate',
            path: 'Slew Rate',
            identifier: 'slewrate',
            type: 'knob_round0',
            min: 0,
            max: 100,
            unit: '%',
            def: 1.0,
            stepSize: 0.1
        },
        {
            name: 'Mix',
            path: 'Mix',
            identifier: 'mix',
            type: 'knob_round0',
            min: 0,
            max: 100,
            unit: '%',
            def: 0,
            stepSize: 0.1
        },
    ]
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden && !fx.modulations.map(m => m.identifier).includes(param.identifier)) )

module.exports = fx