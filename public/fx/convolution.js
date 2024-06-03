const path = require('path')

const uigen = require('./uigen')

const fx = {
    module: 'EffectConvolution',
    name: 'Convolution',
    identifier: 'convolution',
    channels: false,
    channelSortId: 18,
    master: false,
    icon: 'Conv',
    typeId: 3,
    snippet: {
        'Module': 'EffectConvolution',
        'Bypass': 'Off',
        'Impulse': null
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
            name: 'Quality',
            path: 'Quality',
            identifier: 'quality',
            type: 'knob_rate',
            min: 2,
            max: 20,
            unit: 'kHz',
            def: 1,
            stepSize: 0.5,
        },
        {
            name: 'Input Width',
            path: 'Input Width',
            identifier: 'inputwidth',
            type: 'knob_round0',
            min: 0,
            max: 100,
            unit: '%',
            def: 1,
            stepSize: 0.1
        },
        {
            name: 'Pre Delay',
            path: 'Pre Delay',
            identifier: 'predelay',
            type: 'knob_square',
            min: 0,
            max: 200,
            unit: 'ms',
            def: 0.0,
            stepSize: 0.1
        },
        {
            name: 'Decay',
            path: 'Decay',
            identifier: 'decay',
            type: 'knob_volume',
            min: -100,
            max: 18,
            unit: 'dB/sec',
            def: 0.501,
            stepSize: 0.1
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
            stepSize: 0.1
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
            def: 1.0,
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
        {
            name: 'Impulse',
            path: 'Impulse',
            identifier: 'impulse',
            type: 'int_select',
            def: `<${path.resolve((typeof getResourcePath === 'function' ? getResourcePath() : '') , 'assets', 'irs', '480L Fat Plate.wav')}`,
            min: 0,
            max: 2,
            unit: '',
            items: ['480L Fat Plate', 'White Noise 16 kHz', 'White Noise']
        }
    ],
    customParamSetter: (app, chIx, fxIx, paramId, val) => {
        const param = fx.params.find( p => p.identifier === paramId )
        switch (paramId) {
            case 'impulse': {
                const selection = param.items[val]
                const irPath = app.getIrPath(selection)
                app.otherInstrument.state['FX Busses'][chIx]['Effects'][fxIx][param.path] = irPath
                break
            }
            default: {
                app.otherInstrument.state['FX Busses'][chIx]['Effects'][fxIx][param.path] = val
            }
        }
    },
    customParamGetter: (app, chIx, fxIx, paramId) => {
        const param = fx.params.find( p => p.identifier === paramId )
        switch (paramId) {
            case 'impulse': {
                const selection = app.otherInstrument.state['FX Busses'][chIx]['Effects'][fxIx][param.path]
                if (!selection) {
                    return 0
                }
                const fileName = path.basename(selection, '.wav')
                return param.items.findIndex( item => item === fileName )
            }
            default: {
                return app.otherInstrument.state['FX Busses'][chIx]['Effects'][fxIx][param.path]
            }
        }
    }
}


fx.ui = uigen('fx', fx.identifier, fx.params.filter( param => !param.hidden ))
fx.sliceUi = uigen('sliceFx', fx.identifier, fx.params.filter( param => !param.hidden ))

module.exports = fx