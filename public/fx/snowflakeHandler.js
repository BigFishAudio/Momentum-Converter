const availableFx = require('./index')

const fxByModuleName = {}
const fxById = {}

for (let fx of availableFx) {
    if (!(fx.module in fxByModuleName)) {
        fxByModuleName[fx.module] = fx
    }
    if (!(fx.identifier in fxById)) {
        fxById[fx.identifier] = fx
    }
}

const specialSnowFlakes = {
    'EffectPan': (fx) => {
        if (Number.parseFloat(fx['Width'].toFixed(4)) === 0.6667) {
            return fxById['gain']
        } else {
            return fxById['volpan']
        }
    },
    'EffectFilter': (fx) => {
        const mode = fx['Mode']
        switch (mode) {
            case 8: {
                return fxById['statevariablefilter']
            }
            default: {
                return fxById['filter']
            }
        }
    },
    'EffectVocoder': (fx) => {
        const which = Number.parseFloat(fx['Mix'].toFixed(1))
        switch (which) {
            case 0.1: {
                return fxById['glide']
            }
            case 0.2: {
                return fxById['pitch']
            }
            case 0.3: {
                return fxById['stutter']
            }
            case 0.4: {
                return fxById['reverse']
            }
        }
    }
}

module.exports = (fxModule) => {
    const moduleName = fxModule['Module']
    if (moduleName in specialSnowFlakes) {
        return specialSnowFlakes[moduleName](fxModule)
    } else {
        return fxByModuleName[moduleName]
    }
}