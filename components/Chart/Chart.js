import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';

import PriceIndicator from 'highcharts/modules/price-indicator';

import { getCandles } from '../../utils/instruments';

// const INIT_INTERVAL_LENGTH = [408, 104, 35, 9];
const INIT_INTERVAL_TIME = [60000, 300000, 900000, 3600000];

let response;
let responseCandles;

export default function Chart(props) {
    const { instrument, figi, setInprogress, selectedDate, interval, setIsTradingDay } = props;

    const [data, setData] = React.useState([]);
    const refChart = React.useRef(null);

    const getCanglesHandle = React.useCallback(async () => {
        if (!instrument || !setInprogress || !figi || !selectedDate) {
            return;
        }

        setInprogress(true);

        const c = await getCandles(figi, interval + 1, selectedDate);

        if (c && c.candles) {
            const data = c.candles.map(m => {
                return [new Date(m.time).getTime() - (new Date().getTimezoneOffset() * 60000),
                    m.open.units, m.high.units, m.low.units, m.close.units];
            });

            const nextData = data;

            setData(nextData);

            if (!c.candles.length) {
                setIsTradingDay(false);
            }
            setInprogress(false);
        }
    }, [instrument, figi, interval, setInprogress, selectedDate, setIsTradingDay]);

    // React.useEffect(() => {
    //     if (!data || !data.length || response) {
    //         return;
    //     }
    //     console.log('uf1');

    //     const requestOptions = {
    //         cache: 'no-cache',
    //         'Content-Type': 'application/json',
    //     };

    //     async function* readStream(stream) {
    //         const reader = stream.getReader();

    //         for (;;) {
    //             const { value, done } = await reader.read();

    //             if (value) {
    //                 yield Buffer(value).toString('utf8');
    //             }
    //             if (done) {
    //                 break;
    //             }
    //         }
    //     }

    //     const updateData = d => {
    //         console.log('updateData');

    //         const newLastLineData = data[data.length - 1];
    //         const newData = [...data];
    //         const price = d.price.units;

    //         if (
    //             newLastLineData[1] === newLastLineData[2] &&
    //             newLastLineData[2] === newLastLineData[3] &&
    //             newLastLineData[3] === newLastLineData[4] &&
    //             newLastLineData[1] === newLastLineData[4]
    //         ) {
    //             newData.pop();
    //         }
    //         console.log(newData.length);

    //         newData.push([new Date(d.time).getTime() - (new Date().getTimezoneOffset() * 60000), price, price, price, price]);
    //         console.log(newData.length);

    //         setData(newData);
    //     };

    //     try {
    //         const f = async () => {
    //             response = await window.fetch(`http://localhost:8000/${figi}`, requestOptions)
    //                 .then(response => response.body);

    //             for await (const line of readStream(response)) {
    //                 const parsed = JSON.parse(line);

    //                 console.log(parsed);
    //                 updateData(parsed);
    //             }
    //         };

    //         if (!response) {
    //             f();
    //         }

    //     } catch (e) {
    //         return false;
    //     }
    // }, [figi, data]);

    // React.useEffect(() => {
    //     if (!data || !data.length || responseCandles) {
    //         return;
    //     }

    //     console.log('uf2');

    //     const requestOptions = {
    //         cache: 'no-cache',
    //         'Content-Type': 'application/json',
    //     };

    //     async function* readStream(stream) {
    //         const reader = stream.getReader();

    //         for (;;) {
    //             const { value, done } = await reader.read();

    //             if (value) {
    //                 yield Buffer(value).toString('utf8');
    //             }
    //             if (done) {
    //                 break;
    //             }
    //         }
    //     }

    //     const addCandle = m => {
    //         console.log('addCandle');
    //         const newLastLineData = data[data.length - 1];
    //         const newData = [...data];

    //         if (
    //             newLastLineData[1] === newLastLineData[2] &&
    //             newLastLineData[2] === newLastLineData[3] &&
    //             newLastLineData[3] === newLastLineData[4] &&
    //             newLastLineData[1] === newLastLineData[4] ||

    //             newLastLineData[1] === m.open.units &&
    //             newLastLineData[2] === m.high.units &&
    //             newLastLineData[3] === m.low.units &&
    //             newLastLineData[4] === m.close.units
    //         ) {
    //             newData.pop();
    //         }
    //         console.log(newData.length);

    //         newData.push([new Date(m.time).getTime() - (new Date().getTimezoneOffset() * 60000),
    //             m.open.units, m.high.units, m.low.units, m.close.units]);

    //         console.log(newData.length);

    //         setData(newData);
    //     };

    //     try {
    //         const f = async () => {
    //             responseCandles = await window.fetch(`http://localhost:8000/subscribecandles/${figi}?interval=${interval}`, requestOptions)
    //                 .then(response => response.body);

    //             for await (const line of readStream(responseCandles)) {
    //                 const parsed = JSON.parse(line);

    //                 console.log(parsed);
    //                 addCandle(parsed);
    //             }
    //         };

    //         if (!responseCandles) {
    //             f();
    //         }

    //     } catch (e) {

    //         return false;
    //     }
    // }, [figi, data]);

    React.useEffect(() => {
        PriceIndicator(Highcharts);
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
        series: [
            {

                lastVisiblePrice: {
                    enabled: true,
                    label: {
                        enabled: true,
                    },
                },
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
                ref={refChart}
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={options}
            />
        </div>
    );
}
