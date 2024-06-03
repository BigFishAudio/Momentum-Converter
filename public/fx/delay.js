const uigen = require('./uigen')

const fx = {
    module: 'EffectDelay',
    name: 'Delay',
    identifier: 'delay',
    channels: true,
    channelSortId: 2,
    master: false,
    slices: true,
    sliceSortId: 2,
    icon: 'Delay',
    typeId: 4,
    snippet: {
        "Module": "EffectDelay",
        'Bypass': 'Off',
    },
    sliceSnippet: {
        "Module": "EffectDelay",
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
            "Dest": "Time"
          },
          {
            "Module": "EffectMod",
            "CC": 72,
            "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
            "Depth": 1.0,
            "Dest": "Feedback"
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
            name: 'Time',
            dest: 'Time',
            identifier: 'time'
        },
        {
            name: 'Feedback',
            dest: 'Feedback',
            identifier: 'feedback'
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
            type: 'knob_square',
            min: 0,
            max: 4.0,
            unit: 's',
            def: 0,
            stepSize: 0.1,
        },
        {
            name: 'Ratio',
            path: 'Ratio',
            identifier: 'ratio',
            type: 'knob_ratio',
            min: -50,
            max: 50,
            unit: '',
            def: 0.5,
            stepSize: 0.1,
        },
        {
            name: 'Sync',
            path: 'Sync',
            identifier: 'sync',
            type: 'int_select',
            min: 0,
            max: 1,
            unit: '',
            def: 0,
            items: ['sec', 'beats']
        },
        {
            name: 'Feedback',
            path: 'Feedback',
            identifier: 'feedback',
            type: 'knob_round0',
            min: 0,
            max: 100,
            unit: '%',
            def: 0,
            stepSize: 0.1,
        },
        {
            name: 'Feedback Mode',
            path: 'Feedback Mode',
            identifier: 'feedbackmode',
            type: 'int_select',
            min: 0,
            max: 4,
            unit: '',
            def: 0,
            items: ['Stereo', 'Cross', 'Left', 'Right', 'Ping Pong']
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
            name: 'Damping',
            path: 'Damping',
            identifier: 'damping',
            type: 'knob_rate',
            min: 1,
            max: 20,
            unit: 'kHz',
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
        }
    ]
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden && !fx.modulations.map(m => m.identifier).includes(param.identifier)) )

module.exports = fx