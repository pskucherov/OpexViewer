import React, { useCallback, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';

import Accessibility from 'highcharts/modules/accessibility';
import { getPrice } from '../../utils/price';
import { getLastPriceAndOrderBook, getOrderBook } from '../../utils/instruments';

import styles from '../../styles/Terminal.module.css';

const getData = m => {
    return [
        getPrice(m.price),
        m.quantity,
    ];
};

const getSortedBook = (obj, prop) => {
    return obj[prop].map(getData).sort((a, b) => (a[0] - b[0]));
};

export function OrderBook(props) {
    const {
        data,
        step,

        //  setLastPriceInChart,
        serverUri,
        figi,
        interval,
        isBackTest,

        // TODO: определить для бэктеста
        date,
        time,
    } = props;

    const [lastPrice, setLastPrice] = useState();
    const [orderbook, setOrderbook] = useState([]);

    const getOrderBookHandle = React.useCallback(async () => {
        if (!figi) {
            return;
        }

        const c = await (isBackTest ?
            getOrderBook(serverUri, figi, date, time) :
            getLastPriceAndOrderBook(serverUri, figi));

        if (c && c.length) {
            if (typeof step === 'undefined' && !isBackTest) {
                const time = new Date(c[0]['lastPrices'][0].time);
                const price = getPrice(c[0]['lastPrices'][0]['price']);

                setLastPrice(price);

                // Переделать, чтобы orderbook не обновлял цену у графика.
                // setLastPriceInChart(price, time);
            }
            setOrderbook(c[1]);
        }
    }, [figi, interval, serverUri, isBackTest, date, time]); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
        Accessibility(Highcharts);
    }, []);

    React.useEffect(() => {
        getOrderBookHandle();
        const i = !isBackTest && setInterval(() => { getOrderBookHandle() }, 1500);

        return () => { i && clearInterval(i) };
    }, [interval, isBackTest, getOrderBookHandle]);

    let i;
    let bids;
    let asks;

    if (step) {
        i = data.length && typeof step !== 'undefined' && (data[step] ? data[step][0] : data[data.length - 1][0]);
        bids = orderbook[i] && orderbook[i].bids && getSortedBook(orderbook[i], 'bids') || [];
        asks = orderbook[i] && orderbook[i].asks && getSortedBook(orderbook[i], 'asks') || [];
    } else if (orderbook && orderbook.bids) {
        bids = getSortedBook(orderbook, 'bids') || [];
        asks = getSortedBook(orderbook, 'asks') || [];
    }

    const options = {
        chart: {
            type: 'area',
            animation: false,
        },
        navigator: {
            enabled: false,
        },
        scrollbar: {
            enabled: false,
        },
        rangeSelector: false,
        xAxis: {
            minPadding: 0,
            maxPadding: 0,
            type: 'linear',
            step: 1,
            labels: {
                rotation: -45,
                autoRotation: false,
            },
            plotLines: lastPrice ? [{
                color: '#888',
                value: lastPrice,
                width: 1,
                label: {
                    text: lastPrice,
                    rotation: 90,
                },
            }] : undefined,
        },
        yAxis: [{
            lineWidth: 1,
            gridLineWidth: 1,
            title: null,
            tickWidth: 1,
            tickLength: 5,
            tickPosition: 'inside',
            labels: {
                align: 'left',
                x: 8,
            },
            resize: {
                enabled: false,
            },
        }],
        legend: {
            enabled: false,
        },
        plotOptions: {
            area: {
                fillOpacity: 0.2,
                lineWidth: 1,
                step: 'center',
            },
        },
        tooltip: {
            headerFormat: '<span style="font-size=10px;">Price: {point.key}</span><br/>',
            valueDecimals: 0,
        },
        series: [{
            name: 'Спрос',
            data: bids,
            color: '#03a7a8',
            animation: false,
        }, {
            name: 'Предложение',
            data: asks,
            color: '#fc5857',
            animation: false,
        }],
    };

    const [showOrderbook, setShowOrderbook] = useState(true);
    const onClick = useCallback(() => setShowOrderbook(!showOrderbook), [showOrderbook, setShowOrderbook]);

    return (
        <>
            <div
                className={`${styles.OrderBook} ${!showOrderbook ? styles.OrderBook_hidden : ''}`}
            >

                <HighchartsReact
                    highcharts={Highcharts}
                    constructorType={'stockChart'}
                    options={options}
                />
            </div>

            <div
                className={styles.OrderBookHide}
                onClick={onClick}
            >
                { showOrderbook ? 'Скрыть стакан' : 'Показать стакан' }
            </div>
        </>
    );
}
