const fx = require('./index')

const types = []

for (let f of fx) {
    for (let t of f.params.map( p => p.type )) {
        if (!types.includes(t)) {
            types.push(t)
        }
    }
}

console.log(types)