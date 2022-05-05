import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';

// import Indicators from 'highcharts/indicators/indicators-all.js';
// import DragPanes from 'highcharts/modules/drag-panes.js';
// import AnnotationsAdvanced from 'highcharts/modules/annotations-advanced.js';
// import PriceIndicator from 'highcharts/modules/price-indicator.js';
// import FullScreen from 'highcharts/modules/full-screen.js';
// import StockTools from 'highcharts/modules/stock-tools.js';

import { getCandles } from '../../utils/instruments';

// const INIT_INTERVAL_LENGTH = [408, 104, 35, 9];

export default function Chart(props) {
    const { instrument, figi, setInprogress, selectedDate, interval, setIsTradingDay } = props;

    const [data, setData] = React.useState([]);

    const getCanglesHandle = React.useCallback(async () => {
        if (!instrument || !setInprogress || !figi || !selectedDate) {
            return;
        }

        setInprogress(true);

        const c = await getCandles(figi, interval + 1, selectedDate);

        if (c && c.candles) {
            setData(c.candles.map(m => {
                return [new Date(m.time).getTime() - (new Date().getTimezoneOffset() * 60000),
                    m.open.units, m.high.units, m.low.units, m.close.units];
            }));

            if (!c.candles.length) {
                setIsTradingDay(false);
            }
            setInprogress(false);
        }
    }, [instrument, figi, interval, setInprogress, selectedDate, setIsTradingDay]);

    React.useEffect(() => {
        getCanglesHandle();
    }, [getCanglesHandle]);

    const options = {
        chart: {
            height: 400,
        },
        yAxis: [{
            labels: {
                align: 'left',
            },
            height: '80%',
            resize: {
                enabled: true,
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
        },
        series: [{
            type: 'candlestick',
            data: data,
            id: 'myId',
            tooltip: {
                valueDecimals: 2,
            },
        },
        {
            type: 'column',
            data: [],
            yAxis: 1,
        },

            // {
            //     type: 'flags',
            //     useHTML: true,
            //     name: 'Flags on series',
            //     data: marker.buy_price,
            //     title: '<span style="color: green">↑Buy</span>',
            //     onSeries: 'myId',
            //     shape: 'squarepin',
            //     color: 'transparent',
            //     fontSize: '18px',
            // },
            // {
            //     type: 'flags',
            //     useHTML: true,
            //     name: 'Flags on series',
            //     data: marker.sell_price,
            //     title: '<span style="color: red">↓Sell</span>',
            //     onSeries: 'myId',
            //     shape: 'squarepin',
            //     color: 'transparent',
            //     fontSize: '18px',
            //     y: 15,
            // },
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

    return !props.isTradingDay || props.inProgress || !props.setInprogress ? '' : (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={options}
            />
        </div>
    );
}
