import { useRouter } from 'next/router';
import React from 'react';
import Page from '../../components/Page/Page';
import Chart from '../../components/Chart/Chart';
import { getInstrument, getTradingSchedules } from '../../utils/instruments';
import { Spinner, FormGroup, Label, FormText, Button, ButtonGroup } from 'reactstrap';

// eslint-disable-next-line import/no-unresolved
import DatePicker from 'react-datepicker';
const INIT_INTERVAL_TEXT = ['1 мин', '5 мин', '15 мин', '1 час'];

// eslint-disable-next-line import/no-unresolved
import 'react-datepicker/dist/react-datepicker.css';

const INIT_INTERVAL = 1;

const SelectInterval = props => {
    const { setInterval, interval } = props;

    const onButtonClick = React.useCallback(num => {
        // Задаёт интервал для всей страницы.
        // Этот интервал будет использован для построения графика.
        setInterval(num);
    }, [setInterval]);

    return (
        <ButtonGroup>
            {
                INIT_INTERVAL_TEXT.map((i, k) => (
                    <Button
                        key={k}
                        color="primary"
                        outline
                        active={interval === k}
                        onClick={onButtonClick.bind(this, k)}
                    >
                        {i}
                    </Button>
                ))
            }
        </ButtonGroup>
    );
};

const isToday = (date1, date2) => date1.toDateString() === date2.toDateString();

export default function TerminalFigi(props) {
    const router = useRouter();
    const { figi } = router.query;

    const [interval, setInterval] = React.useState(INIT_INTERVAL);
    const [inProgress, setInprogress] = React.useState(true);
    const [isTradingDay, setIsTradingDay] = React.useState();
    const [instrument, setInstrument] = React.useState();
    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const getTradingSchedulesCb = React.useCallback(async (exchange, date) => {
        const currentDate = date || selectedDate;

        let isTradingDayParam = true;
        const today = new Date();

        // Проводятся ли торги можно запрашивать только для текущей и будущих дат.
        // Для прошлых считаем, что торги проводятся и смотрим на наличие исторических данных.
        if (isToday(currentDate, today) || currentDate >= today) {
            const schedule = await getTradingSchedules(exchange, currentDate);

            if (schedule && schedule.exchanges) {
                isTradingDayParam = Boolean(schedule.exchanges[0].days[0].isTradingDay);
            }
        }

        setIsTradingDay(isTradingDayParam);
    }, [selectedDate]);

    const onCalendareChange = React.useCallback(async date => {
        setSelectedDate(date);
        getTradingSchedulesCb(instrument.exchange, date);
    }, [instrument, getTradingSchedulesCb]);

    const getInstrumentCb = React.useCallback(async () => {
        const i = await getInstrument(figi);

        if (!i || !i.ticker) {
            router.push('/instruments');
        } else {
            setInstrument(i);
            await getTradingSchedulesCb(i.exchange);
            setInprogress(false);
        }
    }, [figi, router, getTradingSchedulesCb]);

    React.useEffect(() => {
        if (!router.isReady || instrument) {
            return;
        }

        if (!figi) {
            router.push('/instruments');
        } else {
            getInstrumentCb();
        }
    }, [figi, instrument, router.isReady, getInstrumentCb, router]);

    // if (instrument && (!props || !props.onlyComponent)) {
    return (
        <Page
            title={instrument && (instrument.name + ` (${instrument.ticker})`)}
        >
            <Content
                setInprogress={setInprogress}
                inProgress={inProgress}
                figi={figi}
                instrument={instrument}
                isTradingDay={isTradingDay}
                onCalendareChange={onCalendareChange}
                interval={interval}
                setInterval={setInterval}
                selectedDate={selectedDate}
                setIsTradingDay={setIsTradingDay}
            />
        </Page>
    );

    // } else {
    //     return <Content />;
    // }
}

const Head = props => {
    const { interval, onCalendareChange, setInterval } = props;

    const [startDate, setStartDate] = React.useState(new Date());

    const handleChange = React.useCallback(date => {
        setStartDate(date);
        onCalendareChange(date);
    }, [onCalendareChange]);

    const isWeekday = React.useCallback(date => {
        const day = new Date(date).getDay();

        return day !== 0 && day !== 6;
    }, []);

    return (
        <center>
            <FormGroup>
                <DatePicker
                    dateFormat="dd.MM.yyyy"
                    selected = {startDate}
                    onChange={handleChange}

                    // maxDate={new Date()}
                    filterDate={isWeekday}
                    todayButton="Сегодня"
                    withPortal
                />
            </FormGroup>
            <SelectInterval
                interval={interval}
                setInterval={setInterval}
            />
        </center>
    );
};

const Content = props => {
    return (
        <>
            <Head
                interval={props.interval}
                setInterval={props.setInterval}
                onCalendareChange={props.onCalendareChange}
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

            { props.isTradingDay ? '' : (<><br></br><br></br><center>Данных про торги нет</center></>) }

            {/* // props.instrument && JSON.stringify(props.instrument) */}
            <Chart
                interval={props.interval}
                setInprogress={props.setInprogress}
                inProgress={props.inProgress}
                isTradingDay={props.isTradingDay}
                selectedDate={props.selectedDate}
                figi={props.figi}
                instrument={props.instrument}
                setIsTradingDay={props.setIsTradingDay}
            />
        </>);
};
