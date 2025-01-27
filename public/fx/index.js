module.exports = [
    'compressor',
    'buscompressor',
    'convolution',
    'distortion',
    'eq',
    'filter',
    'guitaramps',
    'limiter',
    'subbass',
    'transient',
    'tremolo',
    // 'pan',
    'chorus',
    'delay',
    'flanger',
    'lofi',
    'nonlinearreverb',
    'phaser',
    'reverb',
    'volpan',
    'glide',
    'pitch',
    'stutter',
    'reverse',
    'gain',
    'statevariablefilter'
].map( fx => require(`./${fx}`) )