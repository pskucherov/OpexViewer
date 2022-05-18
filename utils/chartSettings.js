const chartOptions = {
    chart: {
        height: 400,
        animation: false,
    },
    xAxis: {
        type: 'datetime',
    },

    yAxis: [{
        labels: {
            align: 'left',
        },
        height: '80%',
        resize: {
            enabled: false,
        },
    }, {
        labels: {
            align: 'left',
        },
        top: '80%',
        height: '20%',
        offset: 0,
    }],
    rangeSelector: false,

    // title: {
    //     text: `<b>${datas.name}</b>`,
    //     style: {
    //         fontSize: '26px',
    //         fontWeight: '700',
    //     },
    //     useHTML: true,
    // },
    // subtitle: {
    //     text: `<b>${datas.price} <span style="color: green"> ${datas.up} (${datas.percentage}%)</span></b>`,
    //     align: 'left',
    //     fontWeight: '700',
    //     fontSize: '20px',
    //     useHTML: true,
    // },
    tooltip: {
        style: {
            width: '200px',
        },
        valueDecimals: 4,
        shared: true,
    },
    scrollbar: {
        enabled: false,
    },
    navigator: {
        enabled: false,
    },
    plotOptions: {
        candlestick: {
            color: 'red',
            upColor: 'green',
            label: {
                borderRadius: 10,
            },
        },
        series: {
            pointInterval: 60000,
        },
    },
    series: [
        {

            lastVisiblePrice: {
                enabled: true,
                label: {
                    enabled: true,
                },
            },
            type: 'candlestick',
            data: [], // backtestData || data,
            id: 'candles',
            tooltip: {
                valueDecimals: 2,
            },
            animation: false,
        },

        // {
        //     type: 'column',
        //     data: [],
        //     yAxis: 1,
        // },
        {
            type: 'column',
            name: 'Объём',
            data: [], //backtestVolume || volume,
            yAxis: 1,
            tooltip: {
                valueDecimals: 0,
            },
            animation: false,
        },

        {
            type: 'flags',
            useHTML: true,
            onSeries: 'candles',
            shape: 'squarepin',
            fillColor: '#018000',
            color: '#018000',
            y: -100,
            width: 12,
        },
        {
            type: 'flags',
            useHTML: true,
            onSeries: 'candles',
            shape: 'squarepin',
            fillColor: '#FF2A06',
            color: '#FF2A06',
            y: 50,
            width: 12,
        },

        {
            type: 'flags',
            useHTML: true,
            onSeries: 'candles',
            shape: 'squarepin',
            fillColor: '#0bda51',
            color: '#0bda51',
            y: -50,
            width: 12,
        },
        {
            type: 'flags',
            useHTML: true,
            onSeries: 'candles',
            shape: 'squarepin',
            fillColor: '#ff4d00',
            color: '#ff4d00',
            y: 10,
            width: 12,
        },

    ],
    responsive: {
        rules: [{
            condition: {
                maxWidth: '100%',
            },
            chartOptions: {
                rangeSelector: false,
            },
        }],
    },
};

export {
    chartOptions,
};
