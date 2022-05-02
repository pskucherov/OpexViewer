import { useRouter } from 'next/router';
import React from 'react';
import Page from '../../components/Page/Page';
import { getInstrument } from '../../utils/instruments';
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

export default function TerminalFigi(props) {
    const router = useRouter();
    const { figi } = router.query;

    const [inProgress, setInprogress] = React.useState(true);
    const [isTradingDay, setIsTradingDay] = React.useState();
    const [instrument, setInstrument] = React.useState();
    const [selectedDate, setSelectedDate] = React.useState(new Date());

    // const getTradingSchedulesCb = React.useCallback(async exchange => {
    //     const schedule = await tradingSchedules(exchange, selectedDate);

    //     setIsTradingDay(Boolean(schedule.exchanges[0].days[0].isTradingDay));
    // }, [selectedDate]);

    const getInstrumentCb = React.useCallback(async () => {
        const i = await getInstrument(figi);

        if (!i || !i.ticker) {
            router.push('/instruments');
        } else {
            setInstrument(i);
            setInprogress(false);
        }
    }, [figi, router]);

    React.useEffect(() => {
        if (!router.isReady || instrument) {
            return;
        }

        // if (typeof isTradingDay === 'undefined') {

        // }

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
    }, []);

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
                    maxDate={new Date()}
                    filterDate={isWeekday}
                    withPortal
                />
            </FormGroup>
            <SelectInterval setInprogress={props.setInprogress} />
        </center>
    );
};

const Content = props => (
    <>
        <Head setInprogress={props.setInprogress} />
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
                {props.instrument && JSON.stringify(props.instrument)}
            </>
        )}
    </>
);
