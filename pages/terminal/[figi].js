import { useRouter } from 'next/router';
import React from 'react';
import Page from '../../components/Page/Page';
import { getInstrument, getTradingSchedules } from '../../utils/instruments';
import { Spinner, FormGroup, Label, FormText, Button, ButtonGroup } from 'reactstrap';

import DatePicker from 'react-datepicker';
const interval = ['1 мин', '5 мин', '15 мин', '1 час'];

import 'react-datepicker/dist/react-datepicker.css';

const SelectInterval = props => {
    const [selected, setSelected] = React.useState(1);

    const onButtonClick = React.useCallback(num => {
        props.setInprogress(true);
        setSelected(num);
    }, [props]);

    return (
        <ButtonGroup>
            {
                interval.map((i, k) => (
                    <Button
                        key={k}
                        color="primary"
                        outline
                        active={selected === k}
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

    if (instrument && (!props || !props.onlyComponent)) {
        return (
            <Page
                title={instrument.name + ` (${instrument.ticker})`}
            >
                <Content
                    setInprogress={setInprogress}
                    inProgress={inProgress}
                    figi={figi}
                    instrument={instrument}
                    isTradingDay={isTradingDay}
                    onCalendareChange={onCalendareChange}
                />
            </Page>
        );
    } else {
        return <Content />;
    }
}

const Head = props => {
    const [startDate, setStartDate] = React.useState(new Date());

    const handleChange = React.useCallback(date => {
        setStartDate(date);
        props.onCalendareChange(date);
    }, [props]);

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
            <SelectInterval setInprogress={props.setInprogress} />
        </center>
    );
};

const Content = props => (
    <>
        <Head
            setInprogress={props.setInprogress}
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
        ) : (
            <>
                {props.figi}
                <br></br>
                { props.isTradingDay ?
                    props.instrument && JSON.stringify(props.instrument) :
                    'В этот день торгов нет.'
                }
            </>
        )}
    </>
);
