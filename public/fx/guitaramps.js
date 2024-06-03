const uigen = require('./uigen')

const fx = {
    module: 'EffectGuitarAmps',
    name: 'Guitar Amp',
    identifier: 'guitaramps',
    channels: true,
    channelSortId: 15,
    icon: 'GuitarAmp',
    typeId: 9,
    snippet: {
        'Module': 'EffectGuitarAmps',
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
            name: 'Model',
            path: 'Model',
            identifier: 'model',
            type: 'int_select',
            min: 0,
            max: 3,
            unit: '',
            def: 0,
            items: ['Fender', 'Vox', 'Marshall', 'Marshall Hot']
        },
        {
            name: 'Gain',
            path: 'Gain',
            identifier: 'gain',
            type: 'knob_round0',
            min: 0,
            max: 100,
            unit: '%',
            def: 0.5,
            stepSize: 1,
        },
        {
            name: 'Bass',
            path: 'Bass',
            identifier: 'bass',
            type: 'knob_round0',
            min: 0,
            max: 100,
            unit: '%',
            def: 0.5,
            stepSize: 1
        },
        {
            name: 'Mid',
            path: 'Mid',
            identifier: 'mid',
            type: 'knob_round0',
            min: 0,
            max: 100,
            unit: '%',
            def: 0.5,
            stepSize: 1
        },
        {
            name: 'Treble',
            path: 'Treble',
            identifier: 'treble',
            type: 'knob_round0',
            min: 0,
            max: 100,
            unit: '%',
            def: 0.5,
            stepSize: 1
        },
        {
            name: 'Volume',
            path: 'Volume',
            identifier: 'volume',
            type: 'knob_round0',
            min: 1,
            max: 100,
            unit: '%',
            def: 1,
            stepSize: 0.1
        },
        {
            name: 'Output',
            path: 'Output',
            identifier: 'output',
            type: 'knob_volume',
            min: -100,
            max: 12,
            unit: 'dB',
            def: 0.629960525,
            stepSize: 1
        },
        
    ]
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden ))

module.exports = fx