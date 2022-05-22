import { getPrice } from './price';

const chartOptions = (support, resistance) => {
    return {
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
            plotLines: [
                support ? {
                    color: '#8f0',
                    value: getPrice(support),
                    width: 2,
                    label: {
                        text: getPrice(support),
                    },
                } : undefined,
                resistance ? {
                    color: '#f80',
                    value: getPrice(resistance),
                    width: 2,
                    label: {
                        text: getPrice(resistance),
                    },
                } : undefined,
            ].filter(p => p),
        }, {
            labels: {
                align: 'left',
            },
            top: '80%',
            height: '20%',
            offset: 0,
        }],
        rangeSelector: false,

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
                data: [],
                id: 'candles',
                tooltip: {
                    valueDecimals: 2,
                },
                animation: false,
            },

            {
                type: 'column',
                name: 'Объём',
                data: [],
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
};

export {
    chartOptions,
};
