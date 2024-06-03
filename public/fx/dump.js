const fs = require('fs')
const fx = require('./index')

function rangetrans(X, A, B, C, D) {
    return ((X - A) * ((D - C) / (B - A))) + C
}

const list = {
    effects: fx.map( (f, ix) => ({
        name: f.name,
        ix: ix,
        enabled: {
            master: f.master ? true : false,
            slices: f.slices ? true : false,
            channels: f.channels ? true : false
        },
        parameters: f.params.map( p => ({
            name: p.name,
            min: (p.min || p.min === 0) ? p.min : undefined,
            max: (p.max || p.max === 0) ? p.max : undefined,
            default: (p.min || p.min === 0) ? rangetrans(p.def, 0, 1, p.min, p.max) : p.def ? p.labels.on : p.labels.off,
            unit: p.unit ? p.unit : undefined,
            items: p.items ? p.items.map( (item, ix) => (ix === p.def ? `${item} *` : item) ) : undefined,
            centerline: (Array.isArray(f.modulations) && f.modulations.some( m => m.identifier === p.identifier )) ? ((p.min || p.min === 0) ? rangetrans(p.def, 0, 1, p.min, p.max) : p.def ? p.labels.on : p.labels.off) : undefined,
            modulation: (Array.isArray(f.modulations) && f.modulations.some( m => m.identifier === p.identifier )) ? 0 : undefined
        }))
    }) )
}

fs.writeFileSync( './dump.json', JSON.stringify(list, null, 2) )