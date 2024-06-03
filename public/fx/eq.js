const uigen = require('./uigen')

const fx = {
    module: 'EffectEQ',
    name: 'EQ',
    identifier: 'eq',
    channels: true,
    channelSortId: 5,
    master: true,
    masterSortId: 1,
    icon: 'Eq',
    typeId: 6,
    snippet: {
        'Module': 'EffectEQ',
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
            name: 'Low Gain',
            path: 'Low Gain',
            identifier: 'lowgain',
            type: 'knob_round1',
            min: -20,
            max: 20,
            unit: 'dB',
            def: 0.5,
            stepSize: 1,
        },
        {
            name: 'Low Freq',
            path: 'Low Freq',
            identifier: 'lowfreq',
            type: 'knob_rate',
            min: 50,
            max: 800,
            unit: 'Hz',
            def: 0.25,
            stepSize: 1
        },
        {
            name: 'Low Contour',
            path: 'Low Contour',
            identifier: 'lowcontour',
            type: 'knob_round0',
            min: 0,
            max: 100,
            unit: '%',
            def: 0.0,
            stepSize: 1
        },
        {
            name: 'Mid 1 Gain',
            path: 'Mid 1 Gain',
            identifier: 'mid1gain',
            type: 'knob_round1',
            min: -20,
            max: 20,
            unit: 'dB',
            def: 0.5,
            stepSize: 1,
        },
        {
            name: 'Mid 1 Freq',
            path: 'Mid 1 Freq',
            identifier: 'mid1freq',
            type: 'knob_rate',
            min: 40,
            max: 16000,
            unit: 'Hz',
            def: 0.5,
            stepSize: 1
        },
        {
            name: 'Mid 1 Width',
            path: 'Mid 1 Width',
            identifier: 'mid1width',
            type: 'knob_rate',
            min: 0.333,
            max: 3,
            unit: 'oct',
            def: 0.5,
            stepSize: 0.001
        },
        {
            name: 'Mid 2 Gain',
            path: 'Mid 2 Gain',
            identifier: 'mid2gain',
            type: 'knob_round1',
            min: -20,
            max: 20,
            unit: 'dB',
            def: 0.5,
            stepSize: 1,
        },
        {
            name: 'Mid 2 Freq',
            path: 'Mid 2 Freq',
            identifier: 'mid2freq',
            type: 'knob_rate',
            min: 40,
            max: 16000,
            unit: 'Hz',
            def: 0.5,
            stepSize: 1
        },
        {
            name: 'Mid 2 Width',
            path: 'Mid 2 Width',
            identifier: 'mid2width',
            type: 'knob_rate',
            min: 0.333,
            max: 3,
            unit: 'oct',
            def: 0.6902,
            stepSize: 0.001
        },
        {
            name: 'High Gain',
            path: 'High Gain',
            identifier: 'highgain',
            type: 'knob_round1',
            min: -20,
            max: 20,
            unit: 'dB',
            def: 0.5,
            stepSize: 1,
        },
        {
            name: 'High Freq',
            path: 'High Freq',
            identifier: 'highfreq',
            type: 'knob_rate',
            min: 1,
            max: 16,
            unit: 'kHz',
            def: 0.75,
            stepSize: 0.01
        },
        {
            name: 'High Contour',
            path: 'High Contour',
            identifier: 'highcontour',
            type: 'knob_round0',
            min: 0,
            max: 100,
            unit: '%',
            def: 0.0,
            stepSize: 1
        },
        {
            name: 'Output',
            path: 'Output',
            identifier: 'output',
            type: 'knob_round1',
            min: -20,
            max: 20,
            unit: 'dB',
            def: 0.5,
            stepSize: 1
        }
    ]
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden ))

module.exports = fx