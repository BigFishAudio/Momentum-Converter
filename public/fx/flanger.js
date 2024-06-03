const uigen = require('./uigen')

const fx = {
    module: 'EffectFlanger',
    name: 'Flanger',
    identifier: 'flanger',
    channels: true,
    channelSortId: 11,
    master: true,
    masterSortId: 4,
    slices: true,
    sliceSortId: 11,
    icon: 'Flanger',
    typeId: 8,
    snippet: {
        "Module": "EffectFlanger",
        'Bypass': 'Off',
    },
    sliceSnippet: {
        "Module": "EffectFlanger",
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
                "Dest": "Rate"
              },
              {
                "Module": "EffectMod",
                "CC": 72,
                "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
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
            max: 10.0,
            unit: 'Hz',
            def: 0,
            stepSize: 0.01,
        },
        {
            name: 'Depth',
            path: 'Depth',
            identifier: 'depth',
            type: 'knob_square',
            min: 0,
            max: 12,
            unit: 'ms',
            def: 0,
            stepSize: 0.1
        },
        {
            name: 'Delay',
            path: 'Delay',
            identifier: 'delay',
            type: 'knob_square',
            min: 0,
            max: 12,
            unit: 'ms',
            def: 0.1,
            stepSize: 0.1
        },
        {
            name: 'Feedback',
            path: 'Feedback',
            identifier: 'feedback',
            type: 'knob_round0',
            min: 0,
            max: 100,
            unit: '%',
            def: 0.5,
            stepSize: 0.1
        },
        {
            path: 'Phase',
            name: 'Phase',
            identifier: 'phase',
            type: 'knob_round0',
            min: 0,
            max: 180,
            unit: 'deg',
            def: 0.5,
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