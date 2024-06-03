module.exports = [
    {
        name: "Delay",
        label: "Delay",
        props: {
            'Time': 'squared',
            'Tempo_Sync': 'boolean',
            'Synced_Time': 'stepped',
            'Time_Offset': 'linear',
            'Feedback': 'linear',
            'Feedback_Mode': 'stepped',
            'Damping': 'exp',
        },
        icon: 'Delay',
        bypassParam: 'Delay_OnOff'
    },
    
    {
        name: "Reverb",
        label: "Reverb",
        props: {
            'Time': 'linear',
            'PreDelay': 'squared',
            'LoCut': 'exp',
            'HiCut': 'exp',
            'LowDamping': 'exp',
            'Damping': 'exp',
        },
        icon: 'Reverb',
        bypassParam: 'Reverb_OnOff'
    },
    
    {
        name: "Chorus",
        label: "Chorus",
        props: {
            'Rate': 'exp',
            'Depth': 'squared',
            'Delay': 'squared',
            'Voices': 'linear',
            'Modulation': 'stepped',
        },
        icon: 'Chorus',
        bypassParam: 'Chorus_OnOff'
    },
    
    {
        name: "Flanger",
        label: "Flanger",
        props: {
            'Rate': 'exp',
            'Depth': 'squared',
            'Delay': 'squared',
            'Feedback': 'linear',
            'Phase': 'linear',
        },
        icon: 'Flanger',
        bypassParam: 'Flanger_OnOff'
    },
    
    {
        name: "Phaser",
        label: "Phaser",
        props: {
            'Rate': 'exp',
            'Depth': 'linear',
            'Feedback': 'linear',
            'Poles': 'stepped',
            'Center': 'exp',
            'Spread': 'linear',
        },
        icon: 'Phase',
        bypassParam: 'Phaser_OnOff'
    },

    // {
    //     name: "Conv",
    //     props: {
    //         'Impulse_Select': 'stepped',
    //         'Pre_Delay': 'squared',
    //         'Decay': 'linear',
    //         'Quality': 'exp',
    //         'InputWidth': 'linear'
    //     },
    //     icon: 'Conv',
    //     bypassParam: 'Conv_OnOff'
    // },

    {
        name: "NonLinRev",
        label: "Non Lin Rev",
        props: {
            'Time': 'linear',
            'LoCut': 'exp',
            'HiCut': 'exp',
        },
        icon: 'NonLinearReverb',
        bypassParam: 'NonLinRev_OnOff'
    },


]