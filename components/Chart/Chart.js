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

export default function Chart(props) {
    const {
        instrument, figi, setInprogress,
        selectedDate, interval, setIsTradingDay,
        isTradingDay, serverUri,
        inProgress,
    } = props;

    const [data, setData] = React.useState([]);
    const [volume, setVolume] = React.useState([]);
    const [backtestData, setBacktestData] = React.useState();
    const [backtestVolume, setBacktestVolume] = React.useState();
    const [maxStep, setMaxStep] = useState(0);
    const [step, setStep] = useState();
    const [selectedRobot, setSelectedRobots] = useState();

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

            // Убираем последнюю цену из графика
            const newLastLineData = nextData[nextData.length - 1];

            if (
                newLastLineData[1] === newLastLineData[2] &&
                newLastLineData[2] === newLastLineData[3] &&
                newLastLineData[3] === newLastLineData[4] &&
                newLastLineData[1] === newLastLineData[4]
            ) {
                nextData.pop();
            }

            setData(nextData);
            setVolume(nextVolume);

            setMaxStep(nextData.length - 1);
        }

        return c;
    }, [figi, interval, selectedDate, setMaxStep]);

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
    }, [instrument, figi, setInprogress, selectedDate, setIsTradingDay, updateCandlesHandle]);

    const setLastPriceInChart = useCallback((price, time) => {
        const newLastLineData = data[data.length - 1];
        const newData = [...data];

        // Убираем последнюю цену из графика
        if (
            newLastLineData[1] === newLastLineData[2] &&
            newLastLineData[2] === newLastLineData[3] &&
            newLastLineData[3] === newLastLineData[4] &&
            newLastLineData[1] === newLastLineData[4]
        ) {
            newData.pop();
        }

        newData.push([new Date(time).getTime() - (new Date().getTimezoneOffset() * 60000), price, price, price, price]);
        setData(newData);
    }, [data, setData]);

    React.useEffect(() => {
        PriceIndicator(Highcharts);
    }, []);

    React.useEffect(() => {
        getCandlesHandle();

        const i = setInterval(() => { updateCandlesHandle() }, 5000);

        return () => { clearInterval(i) };
    }, [interval, getCandlesHandle, updateCandlesHandle]);

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

    return (
        <div
            className={styles.Backtest}
        >
            <Terminal
                data={data}
                isTradingDay={isTradingDay}
                inProgress={inProgress}
                setInprogress={setInprogress}
                options={options}
                serverUri={serverUri}
                interval={interval}
                figi={figi}
                setLastPriceInChart={setLastPriceInChart}
                isBackTest={false}
            />
            <Robots
                serverUri={serverUri}
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
                serverUri={serverUri}
                figi={figi}
                selectedDate={selectedDate}
            />
        </div>
    );
}
