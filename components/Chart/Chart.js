import React, { useCallback, useEffect, useState } from 'react';
import Highcharts from 'highcharts/highstock';

import PriceIndicator from 'highcharts/modules/price-indicator';

import { getCandles } from '../../utils/instruments';
import { getPrice } from '../../utils/price';
import { Terminal } from '../Terminal/Terminal';
import { chartOptions } from '../../utils/chartSettings';

import styles from '../../styles/Backtest.module.css';
import { Robots } from '../Robots/Robots';
import { robotFlagsForChart, statusRobot } from '../../utils/robots';
import { RobotsButtons } from '../Robots/RobotsButtons';
import { timezoneDate } from '../../utils/serverStatus';
import { Positions } from '../Robots/Positions';

export default function Chart(props) {
    const {
        instrument, figi, setInprogress,
        selectedDate, interval, setIsTradingDay,
        serverUri,
        inProgress, accountId,
        setRobotStartedStatus, robotStartedStatus,
        robotState,
        selectedRobot, setSelectedRobot,
    } = props;

    const [data, setData] = React.useState([]);
    const [volume, setVolume] = React.useState([]);

    useEffect(() => {
        (async () => {
            const status = await statusRobot(serverUri);

            if (status) {
                setSelectedRobot(status.name);
            }
        })();
    }, [serverUri, setSelectedRobot]);

    const updateCandlesHandle = React.useCallback(async () => {
        const c = await getCandles(serverUri, figi, interval + 1, selectedDate);

        if (c && c.candles) {
            const nextData = [];
            const nextVolume = [];

            c.candles.forEach(m => {
                nextData.push([timezoneDate(m.time),
                    getPrice(m.open), getPrice(m.high), getPrice(m.low), getPrice(m.close),
                ]);
                nextVolume.push([timezoneDate(m.time), m.volume]);
            });

            setData(nextData);
            setVolume(nextVolume);
        }

        return c;
    }, [figi, interval, selectedDate, setData, setVolume, serverUri]);

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
        chart: {
            ...chartOptions.chart,

            // click: function(e) {
            //     console.log(
            //         e.xAxis[0].value,
            //         e.yAxis[0].value,
            //     );
            // },
        },
        series: [
            {
                ...chartOptions.series[0],
                data: data,
            },
            {
                ...chartOptions.series[1],
                data: volume,
            },
        ],
    };

    const {
        buyFlags1,
        sellFlags1,
        buyFlags2,
        sellFlags2,
    } = robotFlagsForChart(chartOptions, robotState, styles);

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

    const positions = robotStartedStatus &&
        robotStartedStatus.positions;

    const orders = robotStartedStatus &&
        robotStartedStatus.orders;

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
            <RobotsButtons
                interval={interval}
                selectedRobot={selectedRobot}
                serverUri={serverUri}
                figi={figi}
                selectedDate={selectedDate}
                robotStartedStatus={robotStartedStatus}
                setRobotStartedStatus={setRobotStartedStatus}
                accountId={accountId}
            />
            <Robots
                serverUri={serverUri}
                selectedRobot={selectedRobot}
                setSelectedRobot={setSelectedRobot}
                disabled={robotStartedStatus}
                setRobotStartedStatus={setRobotStartedStatus}
            />
            <br></br>
            <br></br>

            <Positions
                positions={positions}
                orders={orders}
            />

            <br></br><br></br><br></br><br></br><br></br><br></br>
        </div>
    );
}
