const uigen = require('./uigen')

const fx = {
    module: 'EffectFilter',
    name: 'Filter',
    identifier: 'filter',
    channels: true,
    channelSortId: 16,
    master: true,
    masterSortId: 8,
    slices: true,
    sliceSortId: 16,
    icon: 'Filter',
    typeId: 7,
    snippet: {
        'Module': 'EffectFilter',
        'Bypass': 'Off',
    },
    sliceSnippet: {
        "Module": "EffectFilter",
        'Bypass': 'Off',
        "EffectMods": [
          {
            "Module": "EffectMod",
            "CC": 70,
            "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
            "Depth": 1.0,
            "Dest": "Cutoff"
          },
          {
            "Module": "EffectMod",
            "CC": 71,
            "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
            "Depth": 1.0,
            "Dest": "Resonance"
          }
        ]
    },
    modulations: [
        {
            name: 'Cutoff',
            dest: 'Cutoff',
            identifier: 'cutoff'
        },
        {
            name: 'Resonance',
            dest: 'Resonance',
            identifier: 'resonance'
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
            name: 'Mode',
            path: 'Mode',
            identifier: 'mode',
            type: 'int_select',
            min: 0,
            max: 7,
            unit: '',
            def: 0,
            items: ['LP12', 'LP24', 'LP+', 'BP6', 'HP12', 'HP+', 'Comb+', 'Comb-']
        },
        {
            name: 'Cutoff',
            path: 'Cutoff',
            identifier: 'cutoff',
            type: 'knob_rate',
            min: 20,
            max: 25000,
            unit: 'Hz',
            def: 1.0,
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
            stepSize: 1
        },
    ]
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden && !fx.modulations.map(m => m.identifier).includes(param.identifier)))

module.exports = fx