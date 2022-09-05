import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts/highstock';

import PriceIndicator from 'highcharts/modules/price-indicator';

import { getCandles } from '../../utils/instruments';
import { getPrice } from '../../utils/price';
import { Terminal } from '../Terminal/Terminal';
import { chartOptions } from '../../utils/chartSettings';
import { BacktestButtons } from './BacktestButtons';

import styles from '../../styles/Backtest.module.css';
import { Robots } from '../Robots/Robots';
import { robotFlagsForChart, statusRobot } from '../../utils/robots';
import { Positions } from '../Robots/Positions';

export default function Backtest(props) { // eslint-disable-line sonarjs/cognitive-complexity
    const {
        instrument, figi, setInprogress,
        selectedDate, interval, setIsTradingDay,
        serverUri,
        inProgress,
        setRobotStartedStatus,
        robotState,
        selectedRobot,
        setSelectedRobot,
        accountId,

        robotSetting,
        setRobotSetting,
        brokerId,
    } = props;

    const [data, setData] = React.useState([]);
    const [volume, setVolume] = React.useState([]);
    const [backtestData, setBacktestData] = React.useState();
    const [backtestVolume, setBacktestVolume] = React.useState();
    const [maxStep, setMaxStep] = useState(0);
    const [step, setStep] = useState();

    const [robotPositions, setRobotPositions] = useState();

    useEffect(() => {
        (async () => {
            const status = await statusRobot(serverUri);

            if (status) {
                setSelectedRobot(status.name);
            }
        })();
    }, [serverUri, setSelectedRobot]);

    const getCandlesHandle = React.useCallback(async () => {
        if (!instrument || !setInprogress || !figi || !selectedDate) {
            return;
        }

        setInprogress(true);

        const c = await getCandles(serverUri, figi, interval + 1, selectedDate, 0, brokerId);

        if (c && c.candles && c.candles.length) {
            const nextData = [];
            const nextVolume = [];

            c.candles.forEach(m => {
                const timezoneDate = new Date(m.time).getTime() - (new Date().getTimezoneOffset() * 60000);

                nextData.push([timezoneDate,
                    getPrice(m.open), getPrice(m.high), getPrice(m.low), getPrice(m.close),
                ]);
                nextVolume.push([timezoneDate, parseInt(m.volume, 10)]);
            });

            setData(nextData);
            setVolume(nextVolume);

            setMaxStep(nextData.length - 1);

            if (!c.candles.length && brokerId !== 'FINAM') {
                setIsTradingDay(false);
            }
            setInprogress(false);
        } else {
            setTimeout(() => {
                getCandlesHandle();
            }, 2500);
        }

        return c;
    }, [instrument, figi, interval, setInprogress, serverUri,
        selectedDate, setIsTradingDay, setMaxStep, brokerId]);

    React.useEffect(() => {
        PriceIndicator(Highcharts);

        getCandlesHandle();

        // let i;
        // (async () => {
        //     let c = await getCandlesHandle();

        //     // console.log(1, c);

        //     if (!c || !c.candles || !c.candles.length) {
        //         i = setInterval(async () => {

        //             let c = await getCandlesHandle();
        //             // console.log(2, c);

        //             if (c && c.candles && c.candles.length) {
        //                 // console.log('clear 2', i)
        //                 i && clearInterval(i);
        //             }
        //         }, 2500);
        //     }
        // })();

        // return () => {
        //     console.log('clear 1', i)
        //     i && clearInterval(i);
        // };
    }, [getCandlesHandle, interval, selectedDate]);

    const support = robotSetting && robotSetting.support;
    const resistance = robotSetting && robotSetting.resistance;
    const chartOpts = chartOptions(support, resistance);

    const options = {
        ...chartOpts,

        chart: {
            ...chartOpts.chart,

            // events: {
            //     click: function(e) {
            //         console.log(
            //             e.xAxis[0].value,
            //             e.yAxis[0].value,
            //         );
            //     },
            // },
        },

        series: [
            {
                ...chartOpts.series[0],
                data: backtestData || data,
            },
            {
                ...chartOpts.series[1],
                data: backtestVolume || volume,
            },
        ],
    };

    if (typeof step !== 'undefined') {
        const buyFlags = robotPositions && robotPositions.length ? {
            ...chartOpts.series[2],
            data: robotPositions.filter(p => p.direction === 1).map(p => {
                return data[p.step] && {
                    title: `<div class="${styles.Arrow} ${styles.BuyArrow}">B<br>U<br>Y</div>`,
                    text: `Цена: ${getPrice(p.price)}<br>Лоты: ${p.lots}`,
                    x: data[p.step][0],
                };
            }).filter(p => p),
        } : undefined;

        const sellFlags = robotPositions && robotPositions.length ? {
            ...chartOpts.series[3],
            data: robotPositions.filter(p => p.direction === 2).map(p => {
                return data[p.step] && {
                    title: `<div class="${styles.Arrow} ${styles.SellArrow}">S<br>E<br>L<br>L</div>`,
                    text: `Профит: ${getPrice(p.expectedYield)}<br>Лоты: ${p.lots}`,
                    x: data[p.step][0],
                };
            }).filter(p => p),
        } : undefined;

        if (buyFlags && buyFlags.data.length) {
            options.series.push(buyFlags);
        }

        if (sellFlags && sellFlags.data.length) {
            options.series.push(sellFlags);
        }
    } else {
        const {
            buyFlags1,
            sellFlags1,
            buyFlags2,
            sellFlags2,
        } = robotFlagsForChart(chartOpts, robotState, styles);

        if (buyFlags1 && buyFlags1.data.length) {
            options.series.push(buyFlags1);
        }

        if (sellFlags1 && sellFlags1.data.length) {
            options.series.push(sellFlags1);
        }

        if (buyFlags2 && buyFlags2.data.length) {
            options.series.push(buyFlags2);
        }

        if (sellFlags2 && sellFlags2.data.length) {
            options.series.push(sellFlags2);
        }
    }

    const positions = robotPositions;

    return (
        <div
            className={styles.Backtest}
        >
            <Terminal
                data={data}
                inProgress={inProgress}
                setInprogress={setInprogress}
                options={options}
                serverUri={serverUri}
                step={step}
                interval={interval}
                figi={figi}
                isBackTest={true}
                robotPositions={robotPositions}
                robotSetting={robotSetting}
                brokerId={brokerId}
            />
            {selectedRobot && (<BacktestButtons
                interval={interval}
                setStep={setStep}
                step={step}
                maxStep={maxStep}
                setBacktestData={setBacktestData}
                setBacktestVolume={setBacktestVolume}
                data={data}
                volume={volume}
                selectedRobot={selectedRobot}
                setSelectedRobot={setSelectedRobot}
                serverUri={serverUri}
                figi={figi}
                selectedDate={selectedDate}
                setRobotPositions={setRobotPositions}
                setRobotStartedStatus={setRobotStartedStatus}
                accountId={accountId}
                brokerId={brokerId}
            />)}
            <Robots
                serverUri={serverUri}
                selectedRobot={selectedRobot}
                setSelectedRobot={setSelectedRobot}
                disabled={typeof step !== 'undefined'}
                figi={figi}
                accountId={accountId}

                robotSetting={robotSetting}
                setRobotSetting={setRobotSetting}
            />
            <br></br><br></br>
            <Positions
                positions={positions}
                robotState={robotState}
                figi={figi}
                isBacktest
            />
            <br></br><br></br>
            <br></br><br></br>
            <br></br><br></br>
            <br></br><br></br>
        </div>
    );
}
