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

    const getCanglesHandle = React.useCallback(async () => {
        if (!instrument || !setInprogress || !figi || !selectedDate) {
            return;
        }

        setInprogress(true);

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

            setMaxStep(nextData.length - 1);

            if (!c.candles.length) {
                setIsTradingDay(false);
            }
            setInprogress(false);
        }
    }, [instrument, figi, interval, setInprogress, selectedDate, setIsTradingDay, setMaxStep]);

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
                step={step}
                interval={interval}
                figi={figi}
                isBackTest={true}
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
