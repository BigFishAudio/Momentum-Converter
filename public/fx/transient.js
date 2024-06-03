const uigen = require('./uigen')

const fx = {
    module: 'EffectTransient',
    name: 'Transient',
    identifier: 'transient',
    channels: true,
    channelSortId: 4,
    master: false,
    slices: true,
    sliceSortId: 3,
    icon: 'Transient',
    typeId: 16,
    snippet: {
        'Module': 'EffectTransient',
        'Bypass': 'Off',
    },
    sliceSnippet: {
        "Module": "EffectTransient",
        'Bypass': 'Off',
        "EffectMods": [
          {
            "Module": "EffectMod",
            "CC": 70,
            "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
            "Depth": 1.0,
            "Dest": "Attack"
          },
          {
            "Module": "EffectMod",
            "CC": 71,
            "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
            "Depth": 1.0,
            "Dest": "Hold"
          }
        ]
    },
    modulations: [
        {
            name: 'Attack',
            dest: 'Attack',
            identifier: 'attack'
        },
        {
            name: 'Hold',
            dest: 'Hold',
            identifier: 'hold'
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
            name: 'Attack',
            path: 'Attack',
            identifier: 'attack',
            type: 'knob_round1',
            min: -15,
            max: 15,
            unit: 'dB',
            def: 0.5,
            stepSize: 0.1,
        },
        {
            name: 'Hold',
            path: 'Hold',
            identifier: 'hold',
            type: 'knob_round1',
            min: 0,
            max: 100,
            unit: '%',
            def: 0.5,
            stepSize: 1
        }
    ]
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden && !fx.modulations.map(m => m.identifier).includes(param.identifier)) )

module.exports = fx