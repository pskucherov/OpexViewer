import React, { useCallback, useState } from 'react';
import Highcharts from 'highcharts/highstock';

import PriceIndicator from 'highcharts/modules/price-indicator';

import { getCandles } from '../../utils/instruments';
import { getPrice } from '../../utils/price';
import { Terminal } from '../Terminal/Terminal';
import { chartOptions } from '../../utils/chartSettings';
import { BacktestButtons } from '../Backtest/BacktestButtons';

import styles from '../../styles/Backtest.module.css';
import { Robots } from '../Robots/Robots';
import { statusRobot } from '../../utils/robots';
import { RobotsButtons } from '../Robots/RobotsButtons';

export default function Chart(props) {
    const {
        instrument, figi, setInprogress,
        selectedDate, interval, setIsTradingDay,
        serverUri,
        inProgress, accountId,
    } = props;

    const [data, setData] = React.useState([]);
    const [volume, setVolume] = React.useState([]);
    const [selectedRobot, setSelectedRobots] = useState();
    const [isRobotStarted, setIsRobotStarted] = useState(false);

    React.useEffect(() => {
        (async () => {
            const status = await statusRobot(serverUri);

            if (status) {
                // console.log(statusRobot);
            }
        })();
    }, [serverUri]);

    const updateCandlesHandle = React.useCallback(async () => {
        const c = await getCandles(figi, interval + 1, selectedDate);

        if (c && c.candles) {
            const nextData = [];
            const nextVolume = [];

            c.candles.forEach(m => {
                const timezoneData = new Date(m.time).getTime() - (new Date().getTimezoneOffset() * 60000);

                nextData.push([timezoneData,
                    getPrice(m.open), getPrice(m.high), getPrice(m.low), getPrice(m.close),
                ]);
                nextVolume.push([timezoneData, m.volume]);
            });

            setData(nextData);
            setVolume(nextVolume);
        }

        return c;
    }, [figi, interval, selectedDate, setData, setVolume]);

    const getCandlesHandle = React.useCallback(async () => {
        if (!instrument || !setInprogress || !figi || !selectedDate) {
            return;
        }

        setInprogress(true);

        const c = await updateCandlesHandle();

        if (c && c.candles) {
            if (!c.candles.length) {
                setIsTradingDay(false);
            }
            setInprogress(false);
        }
    }, [instrument, interval, figi, setInprogress, selectedDate, // eslint-disable-line react-hooks/exhaustive-deps
        setIsTradingDay, updateCandlesHandle, setData, setVolume]); // eslint-disable-line react-hooks/exhaustive-deps

    // const setLastPriceInChart = useCallback((price, time) => {
    //     const newLastLineData = data[data.length - 1];
    //     const newData = [...data];

    //     // Убираем последнюю цену из графика
    //     if (
    //         newLastLineData[1] === newLastLineData[2] &&
    //         newLastLineData[2] === newLastLineData[3] &&
    //         newLastLineData[3] === newLastLineData[4] &&
    //         newLastLineData[1] === newLastLineData[4]
    //     ) {
    //         newData.pop();
    //     }

    //     newData.push([new Date(time).getTime() - (new Date().getTimezoneOffset() * 60000), price, price, price, price]);
    //     setData(newData);
    // }, [data, setData, interval]);

    React.useEffect(() => {
        PriceIndicator(Highcharts);
    }, []);

    React.useEffect(() => {
        getCandlesHandle();

        const i = setInterval(() => {
            updateCandlesHandle();
        }, 5000);

        return () => {
            clearTimeout(i);
        };
    }, [interval, getCandlesHandle, updateCandlesHandle]);

    const options = {
        ...chartOptions,
        series: [
            {
                ...chartOptions.series[0],
                data: data,
            },
            {
                ...chartOptions.series[1],
                data: volume,
            },

            // {
            //     ...chartOptions.series[2],
            //     data: [{
            //         title: `<div class="${styles.Arrow} ${styles.BuyArrow}">B<br>U<br>Y</div>`,
            //         text: 'Цена',
            //         x: data && data[50] && data[50][0],
            //     }],
            // },
            // {
            //     ...chartOptions.series[3],
            //     data: [{
            //         title: `<div class="${styles.Arrow} ${styles.SellArrow}">S<br>E<br>L<br>L</div>`,
            //         text: 'Цена',
            //         x: data && data[80] && data[80][0],
            //     }],
            // },
        ],
    };

    return (
        <div
            className={styles.Backtest}
        >
            <Terminal
                data={data}
                dl={data.length}
                inProgress={inProgress}
                setInprogress={setInprogress}
                options={options}
                serverUri={serverUri}
                interval={interval}
                figi={figi}

                // setLastPriceInChart={setLastPriceInChart}
                isBackTest={false}
            />
            <Robots
                serverUri={serverUri}
                setSelectedRobots={setSelectedRobots}
            />
            <RobotsButtons
                interval={interval}
                selectedRobot={selectedRobot}
                serverUri={serverUri}
                figi={figi}
                selectedDate={selectedDate}
                setIsRobotStarted={setIsRobotStarted}
                accountId={accountId}
            />
        </div>
    );
}
