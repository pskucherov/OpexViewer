import React, { useState } from 'react';
import Highcharts from 'highcharts/highstock';

import PriceIndicator from 'highcharts/modules/price-indicator';

import { getCandles } from '../../utils/instruments';
import { getPrice } from '../../utils/price';
import { Terminal } from '../Terminal/Terminal';
import { chartOptions } from '../../utils/chartSettings';
import { BacktestButtons } from './BacktestButtons';

import styles from '../../styles/Backtest.module.css';
import { Robots } from '../Robots/Robots';
import { statusRobot } from '../../utils/robots';

export default function Backtest(props) {
    const {
        instrument, figi, setInprogress,
        selectedDate, interval, setIsTradingDay,
        serverUri,
        inProgress,
        setIsRobotStarted,
    } = props;

    const [data, setData] = React.useState([]);
    const [volume, setVolume] = React.useState([]);
    const [backtestData, setBacktestData] = React.useState();
    const [backtestVolume, setBacktestVolume] = React.useState();
    const [maxStep, setMaxStep] = useState(0);
    const [step, setStep] = useState();
    const [selectedRobot, setSelectedRobots] = useState();

    const [robotPositions, setRobotPositions] = useState();

    const getCanglesHandle = React.useCallback(async () => {
        if (!instrument || !setInprogress || !figi || !selectedDate) {
            return;
        }

        setInprogress(true);

        const c = await getCandles(serverUri, figi, interval + 1, selectedDate);

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

            setMaxStep(nextData.length - 1);

            if (!c.candles.length) {
                setIsTradingDay(false);
            }
            setInprogress(false);
        }
    }, [instrument, figi, interval, setInprogress, serverUri,
        selectedDate, setIsTradingDay, setMaxStep]);

    React.useEffect(() => {
        PriceIndicator(Highcharts);
        getCanglesHandle();
    }, [getCanglesHandle]);

    const options = {
        ...chartOptions,
        series: [
            {
                ...chartOptions.series[0],
                data: backtestData || data,
            },
            {
                ...chartOptions.series[1],
                data: backtestVolume || volume,
            },
        ],
    };

    const buyFlags = robotPositions && robotPositions.length ? {
        ...chartOptions.series[2],
        data: robotPositions.filter(p => p.direction === 1).map(p => {
            return {
                title: `<div class="${styles.Arrow} ${styles.BuyArrow}">B<br>U<br>Y</div>`,
                text: `Цена: ${getPrice(p.price)}<br>Лоты: ${p.lots}`,
                x: data[p.step][0],
            };
        }),
    } : undefined;

    const sellFlags = robotPositions && robotPositions.length ? {
        ...chartOptions.series[3],
        data: robotPositions.filter(p => p.direction === 2).map(p => {
            return {
                title: `<div class="${styles.Arrow} ${styles.SellArrow}">S<br>E<br>L<br>L</div>`,
                text: `Профит: ${getPrice(p.profit)}<br>Лоты: ${p.lots}`,
                x: data[p.step][0],
            };
        }),
    } : undefined;

    if (buyFlags && buyFlags.data.length) {
        options.series.push(buyFlags);
    }

    if (sellFlags && sellFlags.data.length) {
        options.series.push(sellFlags);
    }

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
            />
            <Robots
                serverUri={serverUri}
                selectedRobot={selectedRobot}
                setSelectedRobots={setSelectedRobots}
                disabled={typeof step !== 'undefined'}
            />
            <BacktestButtons
                interval={interval}
                setStep={setStep}
                step={step}
                maxStep={maxStep}
                setBacktestData={setBacktestData}
                setBacktestVolume={setBacktestVolume}
                data={data}
                volume={volume}
                selectedRobot={selectedRobot}
                setSelectedRobots={setSelectedRobots}
                serverUri={serverUri}
                figi={figi}
                selectedDate={selectedDate}
                setRobotPositions={setRobotPositions}
                setIsRobotStarted={setIsRobotStarted}
            />
        </div>
    );
}
