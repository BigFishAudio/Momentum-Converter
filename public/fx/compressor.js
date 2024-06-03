const uigen = require('./uigen')

const fx = {
    module: 'EffectCompressor',
    name: 'Compressor',
    identifier: 'compressor',
    channels: true,
    channelSortId: 3,
    icon: 'Compressor',
    typeId: 1,
    snippet: {
        'Module': 'EffectCompressor',
        'Bypass': 'Off',
    },
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
            name: 'Threshold',
            path: 'Threshold',
            identifier: 'threshold',
            type: 'knob_round1',
            min: -60,
            max: 0,
            unit: 'dB',
            def: 0.5,
            stepSize: 1,
        },
        {
            name: 'Soft Knee',
            path: 'Soft Knee',
            identifier: 'softknee',
            type: 'knob_square',
            min: 0,
            max: 20,
            unit: 'dB',
            def: 0.0,
            stepSize: 0.5
        },
        {
            name: 'Ratio',
            path: 'Ratio',
            identifier: 'ratio',
            type: 'knob_square',
            min: 1,
            max: 20,
            unit: ': 1',
            def: 0.4,
            stepSize: 0.5
        },
        
        {
            name: 'Slam',
            path: 'Slam',
            identifier: 'slam',
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
            type: 'knob_time',
            min: 0.001,
            max: 1,
            unit: 's',
            def: 0.5,
            stepSize: 0.001
        },
        {
            name: 'Release',
            path: 'Release',
            identifier: 'release',
            type: 'knob_time',
            min: 0.01,
            max: 10,
            unit: 's',
            def: 0.5,
            stepSize: 0.01
        },
        {
            name: 'Output',
            path: 'Output',
            identifier: 'output',
            type: 'knob_round1',
            min: 0,
            max: 20,
            unit: 'dB',
            def: 0.0,
            stepSize: 0.5
        }
    ]
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden ))

module.exports = fx