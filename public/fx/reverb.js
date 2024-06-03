const uigen = require('./uigen')

const fx = {
    module: 'EffectReverb',
    name: 'Reverb',
    identifier: 'reverb',
    channels: true,
    channelSortId: 0,
    master: false,
    slices: true,
    sliceSortId: 0,
    icon: 'Reverb',
    typeId: 14,
    snippet: {
        "Module": "EffectReverb",
        'Bypass': 'Off',
    },
    sliceSnippet: {
        "Module": "EffectReverb",
        'Bypass': 'Off',
        "EffectMods": [
          {
            "Module": "EffectMod",
            "CC": 70,
            "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
            "Depth": 0.0,
            "Dest": "Input Trim"
          },
          {
            "Module": "EffectMod",
            "CC": 71,
            "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
            "Depth": 0.0,
            "Dest": "Time"
          }
        ],
        "Time": 0.46,
        "Low Cut": 0.25,
        "Damping": 0.352,
        "Low Damping": 0.25
    },
    modulations: [
        {
            name: 'Send Level',
            dest: 'Input Trim',
            identifier: 'inputtrim'
        },
        {
            name: 'Time',
            dest: 'Time',
            identifier: 'time'
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
            name: 'Time',
            path: 'Time',
            identifier: 'time',
            type: 'knob_round1',
            min: 0,
            max: 100,
            unit: '%',
            def: 0,
            stepSize: 0.1,
        },
        {
            name: 'Pre Delay',
            path: 'Pre Delay',
            identifier: 'predelay',
            type: 'knob_square',
            min: 0,
            max: 200,
            unit: 'ms',
            def: 0.283,
            stepSize: 0.1,
        },
        {
            name: 'Low Cut',
            path: 'Low Cut',
            identifier: 'lowcut',
            type: 'knob_rate',
            min: 20,
            max: 2000,
            unit: 'Hz',
            def: 0.5,
            stepSize: 1,
        },
        {
            name: 'Low Damping',
            path: 'Low Damping',
            identifier: 'lowdamping',
            type: 'knob_rate',
            min: 20,
            max: 2000,
            unit: 'Hz',
            def: 0.0,
            stepSize: 0.1,
        },
        {
            name: 'High Cut',
            path: 'High Cut',
            identifier: 'highcut',
            type: 'knob_rate',
            min: 2,
            max: 20,
            unit: 'kHz',
            def: 0.7,
            stepSize: 0.1,
        },
        {
            name: 'Damping',
            path: 'Damping',
            identifier: 'damping',
            type: 'knob_rate',
            min: 2,
            max: 20,
            unit: 'kHz',
            def: 0.7,
            stepSize: 0.1,
        },
        {
            hidden: true,
            name: 'Dry',
            path: 'Dry',
            identifier: 'dry',
            type: 'knob_volume',
            min: -100,
            max: 0,
            unit: 'dB',
            def: 1.0,
            stepSize: 0.1,
        },
        {
            hidden: true,
            name: 'Wet',
            path: 'Wet',
            identifier: 'wet',
            type: 'knob_volume',
            min: -100,
            max: 0,
            unit: 'dB',
            def: 1.0,
            stepSize: 0.1,
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
            stepSize: 0.1,
            hidden: false,
        },
        {
            name: 'Input Trim',
            path: 'Input Trim',
            identifier: 'inputtrim',
            type: 'knob_volume',
            min: -100,
            max: 0,
            unit: 'dB',
            def: 0,
            stepSize: 0.1,
        },
    ]
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden && !fx.modulations.map(m => m.identifier).includes(param.identifier)) )

module.exports = fx