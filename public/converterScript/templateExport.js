const effectHandler = require('./effectHandler')
const path = require('path')
const fs = require('fs')

const {
    fxForModules,
    modulationsForFx,
    _moduleForId,
    _setModulationValuesNormalised,
    GE_VERSION
} = effectHandler

const dir = process.argv.length > 2 ? process.argv[process.argv.length-1] : "/Users/nils/src/bfa-oyster-proto/sample-inst/editor/01 125 Fmin.inst"
const instPath = path.resolve(dir)
const raw = fs.readFileSync(instPath)
const inst = JSON.parse(raw)
const fxBusses = inst['FX Busses']

const converted = fxBusses.map( (bus, ix) => 
    (ix < 40 || ix === 86) ?
        Object.assign({}, bus, {
            ['Effects']: bus['Effects'].map( (fx, iy) => _moduleForId(fxForModules(fx).identifier, (ix !== 86 && iy < 8)))
        })
   : bus
)

let modulations = new Array(40).fill(0).map( a => new Int32Array(30720) )

for (let cix = 0; cix < 40; cix++) {
    for (let eix = 0; eix < 8; eix++) {
        for (let pix = 0; pix < 3; pix++) {
            const fx = fxForModules(fxBusses[cix]['Effects'][eix])
            const values = modulationsForFx(fx, pix)
            for (let zix = 0; zix < 10; zix++) {
                _setModulationValuesNormalised({effect: eix, parameter: pix, zone: zix, values, target: modulations[cix]})
            }
        }
    }
}

modulations = modulations.reduce( (prev, cur, ix) => Object.assign(prev, {
    [`FXSliceData${ix+1}`]: Array.from(cur)
}), {})

const dataz = JSON.stringify(
    {
        GE_VERSION,
        busses: converted,
        modulations
    }
)

fs.writeFileSync('exportedTemplateFxBusses.json', dataz)