const uigen = require('./uigen')

const fx = {
    module: 'EffectPan',
    name: 'Vol/Pan',
    identifier: 'volpan',
    channels: false,
    slices: true,
    sliceSortId: 5,
    master: false,
    icon: 'VolPan',
    typeId: 26,
    snippet: null,
    sliceSnippet: {
        "Module": "EffectPan",
        "Width": 0.6666,
        "EffectMods": [
            {
                "Module": "EffectMod",
                "CC": 70,
                "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
                "Depth": 1.0,
                "Dest": "Gain"
            },
            {
                "Module": "EffectMod",
                "CC": 71,
                "Steps": [ 0.0, 0.3826799989, 0.7071099877, 0.923879981, 1.0, 0.923879981, 0.7071099877, 0.3826799989, 0.0, -0.3826799989, -0.7071099877, -0.923879981, -1.0, -0.923879981, -0.7071099877, -0.3826799989 ],
                "Depth": 1.0,
                "Dest": "Pan"
            },
        ]
    },
    modulations: [
        {
            name: 'Gain',
            dest: 'Gain',
            identifier: 'gain',
        },
        {
            name: 'Pan',
            dest: 'Pan',
            identifier: 'pan',
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
            name: 'Gain',
            path: 'Gain',
            identifier: 'gain',
            type: 'knob_volume',
            min: -100,
            max: 12.04,
            unit: 'dB',
            def: 0.629960525,
            stepSize: 0.05,
        },
        {
            name: 'Pan',
            path: 'Pan',
            identifier: 'pan',
            type: 'knob_pan',
            min: -100,
            max: 100,
            unit: '',
            def: 0.5,
            stepSize: 0.05,
        }
    ]
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden && !fx.modulations.map(m => m.identifier).includes(param.identifier)) )

module.exports = fx