const uigen = require('./uigen')

const fx = {
    module: 'EffectLimiter',
    name: 'Limiter',
    identifier: 'limiter',
    channels: true,
    channelSortId: 9,
    master: true,
    masterSortId: 3,
    slices: true,
    sliceSortId: 13,
    icon: 'Limiter',
    typeId: 10,
    snippet: {
        'Module': 'EffectLimiter',
        'Maximize': 1,
        'Bypass': 'Off',
    },
    sliceSnippet: {
        "Module": "EffectLimiter",
        'Bypass': 'Off',
        "EffectMods": [
          {
            "Module": "EffectMod",
            "CC": 70,
            "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
            "Depth": 1.0,
            "Dest": "Drive"
          }
        ],
        "Maximize": "On"
    },
    modulations: [
        {
            name: 'Input',
            dest: 'Drive',
            identifier: 'drive'
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
            def: 0
        },
        {
            name: 'Release',
            path: 'Release',
            identifier: 'release',
            type: 'knob_rate',
            min: 0.1,
            max: 10,
            unit: 's',
            def: 0.5,
            stepSize: 0.1,
        },
        {
            name: 'Mode',
            path: 'Mode',
            identifier: 'mode',
            type: 'int_select',
            min: 0,
            max: 2,
            unit: '',
            def: 0,
            items: ['Soft', 'Hard', 'Clip']
        },
        
        {
            hidden: true,
            name: 'Drive',
            path: 'Drive',
            identifier: 'drive',
            type: 'knob_round1',
            min: 0,
            max: 60,
            unit: 'dB',
            def: 0,
            stepSize: 1
        }
    ]
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden && !fx.modulations.map(m => m.identifier).includes(param.identifier)) )

module.exports = fx