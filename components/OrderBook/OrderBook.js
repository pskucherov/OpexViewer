import React, { useCallback, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';

import Accessibility from 'highcharts/modules/accessibility';
import { getPrice } from '../../utils/price';
import { getOrderBook } from '../../utils/instruments';

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
        currentPrice,
        serverUri,
        figi,
        interval,
    } = props;

    const [orderbook, setOrderbook] = useState([]);

    const getOrderBookHandle = React.useCallback(async () => {
        if (!figi) {
            return;
        }

        const c = await getOrderBook(serverUri, figi);

        if (c) {
            setOrderbook(c);
        }
    }, [figi, interval, serverUri]); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
        Accessibility(Highcharts);
        getOrderBookHandle();
    }, [getOrderBookHandle]);

    const i = data.length && typeof step !== 'undefined' && (data[step] ? data[step][0] : data[data.length - 1][0]);

    const bids = orderbook[i] && orderbook[i].bids && getSortedBook(orderbook[i], 'bids') || [];
    const asks = orderbook[i] && orderbook[i].asks && getSortedBook(orderbook[i], 'asks') || [];

    const options = {
        chart: {
            type: 'area',
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
            plotLines: currentPrice ? [{
                color: '#888',
                value: currentPrice,
                width: 1,
                label: {
                    text: '',
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
        }, {
            name: 'Предложение',
            data: asks,
            color: '#fc5857',
        }],
    };

    return (
        <div
            className={styles.OrderBook}
        >
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={options}
            />
        </div>
    );
}
