import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Chart from '../../../components/Chart/Chart';
import Backtest from '../../../components/Backtest/Backtest';
import { getInstrument, getTradingSchedules, getFinamInstrument } from '../../../utils/instruments';
import { Spinner, FormGroup, Button, ButtonGroup } from 'reactstrap';

import { getFromSS, setToSS } from '../../../utils/storage';

import DatePicker from 'react-datepicker';
const INIT_INTERVAL_TEXT = ['1 мин', '5 мин', '15 мин', '1 час'];

import 'react-datepicker/dist/react-datepicker.css';
import { getRobotLogs } from '../../../utils/robots';
import { isToday } from '../../../utils/serverStatus';

const INIT_INTERVAL = 1;

const SelectInterval = props => {
    const { setTickerInterval, interval, disabled, brokerId } = props;

    const onButtonClick = React.useCallback(num => {
        // Задаёт интервал для всей страницы.
        // Этот интервал будет использован для построения графика.
        setTickerInterval(num);
        setToSS('interval', num);
    }, [setTickerInterval]);

    return (
        <ButtonGroup>
            {
                INIT_INTERVAL_TEXT.map((i, k) => (
                    <Button
                        key={k}
                        color="primary"
                        outline={interval !== k}
                        active={interval === k}
                        onClick={onButtonClick.bind(this, k)}
                        disabled={disabled}
                    >
                        {i}
                    </Button>
                ))
            }
        </ButtonGroup>
    );
};

export default function PortfolioTerminal(props) {
    const router = useRouter();

    return router.query.figi.split('|').map((figi, k) => <TerminalFigi
        {...props}
        figi={figi}
        key={k}
    />);
}

function TerminalFigi(props) {
    const {
        setTitle,
        serverUri,
        accountId,
        robotStartedStatus,
        setRobotStartedStatus,
        brokerId,
        checkRobot,
        figi,
    } = props;

    const router = useRouter();
    const routerPush = router.push;
    const { isReady } = router;

    const lsData = getFromSS();

    const [interval, setTickerInterval] = React.useState(lsData && lsData['interval'] || INIT_INTERVAL);
    const [inProgress, setInprogress] = React.useState(true);
    const [isTradingDay, setIsTradingDay] = React.useState();
    const [instrument, setInstrument] = React.useState();
    const [selectedDate, setSelectedDate] = React.useState(lsData && lsData['selectedDate'] && new Date(lsData['selectedDate']) || new Date());
    const [isBacktest, setIsBackTest] = useState(!isToday(new Date(), selectedDate));

    const getTradingSchedulesCb = React.useCallback(async (exchange, date) => {
        if (brokerId === 'FINAM') {
            setIsTradingDay(true);

            return;
        }

        const currentDate = date || selectedDate;

        let isTradingDayParam = true;
        const today = new Date();

        // Проводятся ли торги можно запрашивать только для текущей и будущих дат.
        // Для прошлых считаем, что торги проводятся и смотрим на наличие исторических данных.
        if (isToday(currentDate, today) || currentDate >= today) {
            const schedule = await getTradingSchedules(serverUri, exchange, currentDate);

            if (schedule && schedule.exchanges) {
                isTradingDayParam = Boolean(schedule.exchanges[0].days[0].isTradingDay);
            }
        }

        setIsTradingDay(isTradingDayParam);
    }, [selectedDate, serverUri, brokerId]);

    const onCalendareChange = React.useCallback(async date => {
        setSelectedDate(date);
        setToSS('selectedDate', date);

        instrument.exchange && getTradingSchedulesCb(instrument.exchange, date);
        setIsBackTest(!isToday(new Date(), new Date(date)));
    }, [instrument, getTradingSchedulesCb]);

    const getInstrumentCb = React.useCallback(async () => {
        const i = brokerId === 'FINAM' ? await getFinamInstrument(serverUri, figi) : await getInstrument(serverUri, figi);

        if (!i || !i.ticker) {
            routerPush('/instruments');
        } else {
            setInstrument(i);
            await getTradingSchedulesCb(i.exchange);
            setInprogress(false);
        }
    }, [figi, routerPush, getTradingSchedulesCb, serverUri, brokerId]);

    React.useEffect(() => {
        if (!isReady || instrument) {
            return;
        }

        if (!figi) {
            routerPush('/instruments');
        } else {
            getInstrumentCb();
        }
    }, [figi, instrument, isReady, getInstrumentCb, routerPush]);

    React.useEffect(() => {
        if (instrument) {
            let title = instrument.name + ` (${instrument.ticker})`;

            if (isBacktest) {
                title += '. Backtest.';
            }

            setTitle(title);
        }
    }, [setTitle, instrument, isBacktest]);

    return (<Content
        setInprogress={setInprogress}
        inProgress={inProgress}
        figi={figi}
        brokerId={brokerId}
        instrument={instrument}
        isTradingDay={isTradingDay}
        onCalendareChange={onCalendareChange}
        interval={interval}
        setTickerInterval={setTickerInterval}
        selectedDate={selectedDate}
        setIsTradingDay={setIsTradingDay}
        isBacktest={isBacktest}
        serverUri={serverUri}
        accountId={accountId}
        robotStartedStatus={robotStartedStatus}
        setRobotStartedStatus={setRobotStartedStatus}
        checkRobot={checkRobot}
    />);
}

const Head = props => {
    const {
        interval, onCalendareChange, setTickerInterval, selectedDate, robotStartedStatus,
    } = props;

    const isWeekday = React.useCallback(date => {
        const day = new Date(date).getDay();

        return day !== 0 && day !== 6;
    }, []);

    return (
        <center>
            <FormGroup>
                <DatePicker
                    dateFormat="dd.MM.yyyy"
                    selected={selectedDate}
                    onChange={onCalendareChange}

                    maxDate={new Date()}
                    filterDate={isWeekday}
                    withPortal
                    disabled={Boolean(robotStartedStatus)}
                />
            </FormGroup>
            <SelectInterval
                interval={interval}
                setTickerInterval={setTickerInterval}
                disabled={Boolean(robotStartedStatus)}
            />
        </center>
    );
};

const Content = props => {
    const { serverUri,
        accountId,
        robotStartedStatus,
        setRobotStartedStatus,
        figi,
        selectedDate,
        brokerId,
        interval,
        checkRobot,
    } = props;

    const [robotState, setRobotState] = useState();
    const [selectedRobot, setSelectedRobot] = useState();

    useEffect(() => {
        let i;

        (async () => {
            if (selectedRobot && accountId && figi) {
                if (isToday(selectedDate, new Date())) {
                    // selectedRobot используется для того, чтобы при выборе робота показывать сделки.
                    // когда робот запущен показывать их уже нужно по интервалу.
                    i = setInterval(async () => {
                        const logs = await getRobotLogs(serverUri, selectedRobot,
                            accountId, figi, selectedDate.getTime());

                        setRobotState(logs);
                    }, 30000);
                }

                const logs = await getRobotLogs(serverUri, selectedRobot, accountId, figi, selectedDate.getTime());

                setRobotState(logs);
            }
        })();

        return () => {
            i && clearInterval(i);
        };
    }, [setRobotState, serverUri, accountId, figi, selectedDate, selectedRobot]);

    const [robotSetting, setRobotSetting] = useState({
        support: {},
        resistance: {},
    });

    return (
        <>
            <Head
                interval={interval}
                setTickerInterval={props.setTickerInterval}
                onCalendareChange={props.onCalendareChange}
                selectedDate={selectedDate}
                robotStartedStatus={robotStartedStatus}
            />
            {props.inProgress ? (
                <>
                    <center>
                        <br></br>
                        <Spinner color="primary">
                            Loading...
                        </Spinner>
                    </center>
                </>
            ) : ''}
            {/* TODO: Переделать эту жесть на redux / context :facepalm: */}
            {props.isTradingDay ? (props.isBacktest ? (
                <Backtest
                    interval={interval}
                    setInprogress={props.setInprogress}
                    inProgress={props.inProgress}
                    selectedDate={props.selectedDate}
                    figi={figi}
                    instrument={props.instrument}
                    setIsTradingDay={props.setIsTradingDay}
                    serverUri={serverUri}
                    robotStartedStatus={robotStartedStatus}
                    setRobotStartedStatus={setRobotStartedStatus}
                    robotState={robotState}
                    selectedRobot={selectedRobot}
                    setSelectedRobot={setSelectedRobot}
                    accountId={accountId}

                    robotSetting={robotSetting}
                    setRobotSetting={setRobotSetting}
                    brokerId={brokerId}
                />
            ) : (
                <>
                    {/* TODO: Переделать эту жесть на redux / context :facepalm: */}
                    <Chart
                        interval={props.interval}
                        setInprogress={props.setInprogress}
                        inProgress={props.inProgress}
                        selectedDate={props.selectedDate}
                        figi={figi}
                        instrument={props.instrument}
                        setIsTradingDay={props.setIsTradingDay}
                        serverUri={serverUri}
                        accountId={accountId}
                        setRobotStartedStatus={setRobotStartedStatus}
                        robotStartedStatus={robotStartedStatus}
                        robotState={robotState}
                        selectedRobot={selectedRobot}
                        setSelectedRobot={setSelectedRobot}

                        robotSetting={robotSetting}
                        setRobotSetting={setRobotSetting}
                        brokerId={brokerId}
                        checkRobot={checkRobot}
                    /></>
            )) : (<><br></br><br></br><center>Биржа закрыта.</center></>)}
        </>);
};
