const uigen = require('./uigen')

const fx = {
    module: 'EffectBusCompressor',
    name: 'Bus Compressor',
    identifier: 'buscompressor',
    master: true,
    masterSortId: 0,
    icon: 'BusComp',
    typeId: 2,
    snippet: {
        'Module': 'EffectBusCompressor',
        'Bypass': 'Off'
    },
    params: [
        {
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
        },
        {
            name: 'Parallel Mix',
            path: 'Parallel Mix',
            identifier: 'parallelmix',
            type: 'knob_round1',
            min: 0,
            max: 100,
            unit: '%',
            def: 0,
            stepSize: 1
        },
        
    ],
}

fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden ))

module.exports = fx