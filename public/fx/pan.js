const uigen = require('./uigen')

const fx = {
    module: 'EffectTremoloPan',
    name: 'Pan',
    identifier: 'pan',
    channels: true,
    slices: false,
    master: false,
    icon: 'Pan',
    typeId: 17,
    snippet: {
        'Module': 'EffectTremoloPan',
        'Bypass': 'Off',
        'Attack Curve': 0.666 // Tremolo (Tremolo effect) has an Attack Curve of 0.667 we use this to tell them apart since they are the same efffect module under the hood
    },
    sliceSnippet: {
        "Module": "EffectTremoloPan",
        'Bypass': 'Off',
        'Attack Curve': 0.666, // Tremolo (Tremolo effect) has an Attack Curve of 0.667 we use this to tell them apart since they are the same efffect module under the hood
        "EffectMods": [
          {
            "Module": "EffectMod",
            "CC": 70,
            "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
            "Depth": 1.0,
            "Dest": "Depth"
          },
          {
            "Module": "EffectMod",
            "CC": 71,
            "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
            "Depth": 1.0,
            "Dest": "Rate"
          }
        ]
    },
    modulations: [
        {
            name: 'Depth',
            dest: 'Depth',
            identifier: 'depth',
        },
        {
            name: 'Rate',
            dest: 'Rate',
            identifier: 'rate',
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
            name: 'Sync',
            path: 'Sync',
            identifier: 'sync',
            type: 'int_select',
            min: 0,
            max: 1,
            unit: '',
            def: 0,
            items: ['Hz', 'per beat']
        },
        {
            name: 'Rate',
            path: 'Rate',
            identifier: 'rate',
            type: 'knob_rate',
            min: 0.05,
            max: 20,
            unit: '',
            def: 0.616,
            stepSize: 0.05,
        },
        {
            name: 'Depth',
            path: 'Depth',
            identifier: 'depth',
            type: 'knob_round0',
            min: 0,
            max: 100,
            unit: '%',
            def: 1,
            stepSize: 1
        },
        {
            name: 'Spread',
            path: 'Spread',
            identifier: 'spread',
            type: 'knob_round0',
            min: 0,
            max: 360,
            unit: 'deg',
            def: 0,
            stepSize: 1
        }
    ]
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden && !fx.modulations.map(m => m.identifier).includes(param.identifier)) )

module.exports = fx