const uigen = require('./uigen')

const fx = {
    module: 'EffectSubBass',
    name: 'Sub Bass',
    identifier: 'subbass',
    channels: true,
    channelSortId: 6,
    slices: true,
    sliceSortId: 4,
    master: false,
    icon: 'SubBass',
    typeId: 15,
    snippet: {
        'Module': 'EffectSubBass',
        'Bypass': 'Off',
    },
    sliceSnippet: {
        "Module": "EffectSubBass",
        'Bypass': 'Off',
        "EffectMods": [
          {
            "Module": "EffectMod",
            "CC": 70,
            "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
            "Depth": 1.0,
            "Dest": "Mix"
          }
        ]
    },
    modulations: [
        {
            name: 'Mix',
            dest: 'Mix',
            identifier: 'mix'
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
            name: 'Max Freq',
            path: 'Max Freq',
            identifier: 'maxfreq',
            type: 'knob_rate',
            min: 35,
            max: 560,
            unit: 'Hz',
            def: 0.5,
            stepSize: 1,
        },
        {
            name: 'Tone',
            path: 'Tone',
            identifier: 'tone',
            type: 'knob_round0',
            min: 0,
            max: 100,
            unit: '%',
            def: 0.5,
            stepSize: 1
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
            def: 1,
            stepSize: 1
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
            def: 0.7937,
            stepSize: 1
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
        }
    ]
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden && !fx.modulations.map(m => m.identifier).includes(param.identifier)))

module.exports = fx