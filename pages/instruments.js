import React from 'react';

import styles from '../styles/Settings.module.css';
import Page from '../components/Page/Page';
import { ButtonGroup, Button, CardGroup, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Spinner } from 'reactstrap';
import { getInstruments } from '../utils/instruments';

// Голубые фишки
// Объём торгов внутри дня (ТОП-10)
// Волатильность внутри дня (ТОП-10)
// Фьючерсы

export default function Instruments() {
    return (
        <Page
            title="Instruments"
        >
            <SelectInstrument/>
        </Page>
    );
}

// TODO: redux
const defaultServerUri = 'http://localhost:8000/';

const SelectInstrument = () => {
    const [buttonActive, setButtonActive] = React.useState();
    const [inProgress, setInprogress] = React.useState(false);
    const [instrumenst, setInstrumenst] = React.useState();
    const instrumentsButtons = [
        {
            page: 'bluechipsshares',
            name: 'Голубые фишки',
        },
        {
            page: 'bluechipsfutures',
            name: 'Фьючерсы',
        },
        {
            page: 'bluechipsshares',
            name: 'Объём торгов внутри дня (ТОП-3)',
        },
        {
            page: 'bluechipsshares',
            name: 'Волатильность внутри дня (ТОП-3)',
        },
    ];

    const instrumentPage = React.useMemo(() => instrumentsButtons, []);

    const onButtonClick = React.useCallback(async num => {
        setButtonActive(num);
        setInprogress(true);
        setInstrumenst(await getInstruments(defaultServerUri + instrumentPage[num].page));
        setInprogress(false);
    }, [instrumentPage]);

    return (
        <>
            <ButtonGroup>
                {instrumentPage.slice(0, 2).map((i, k) => (
                    <Button
                        key={k}
                        color="primary"
                        outline
                        block
                        active={buttonActive === k}
                        onClick={onButtonClick.bind(this, k)}
                    >
                        {i.name}
                    </Button>
                ))}
            </ButtonGroup>
            <br></br>
            <ButtonGroup>
                {instrumentPage.slice(2, 4).map((i, k) => (
                    <Button
                        key={k}
                        color="primary"
                        outline
                        block
                        active={buttonActive === k + 2}
                        onClick={onButtonClick.bind(this, k + 2)}
                    >
                        {i.name}
                    </Button>
                ))}
            </ButtonGroup>
            <br></br>
            {
                inProgress ? (
                    <center><Spinner color="primary">
                        Loading...
                    </Spinner></center>
                ) : instrumenst && instrumenst.instruments ? (
                    <>
                        <GroupInstruments instrumenst={instrumenst.instruments} />
                    </>
                ) : ''
            }
        </>
    );
};

const GroupInstruments = props => {
    const chunks = [];
    const group = [];

    props.instrumenst.forEach((i, k) => {
        const card = (
            <CardInstrument
                name={i.name + ` (${i.ticker})`}
                figi={i.figi}
                key={k}
            />
        );

        chunks.push(card);

        if (chunks.length && !(chunks.length % 3)) {
            group.push(chunks);
            chunks = [];
        }
    });

    if (chunks.length) {
        group.push(chunks);
    }

    return group.map((g, k) => (
        <CardGroup key={k}>
            {g}
        </CardGroup>
    ));
};

const CardInstrument = props => {
    return (
        <Card>
            {/*
            Здесь может быть график
            <CardImg
                alt="Card image cap"
                src="https://picsum.photos/318/180"
                top
                width="100%"
            /> */}
            <CardBody>
                <CardTitle tag="h5">
                    {props.name}
                </CardTitle>
                <CardSubtitle
                    className="mb-2 text-muted"
                    tag="h6"
                >
                    {props.figi}
                </CardSubtitle>
                {/* <CardText>История (5 мин):</CardText> */}
                <Button
                    color="primary"
                    outline
                    disabled
                >
                            Терминал
                </Button>
                <Button
                    color="primary"
                    outline
                >
                            Бэктест
                </Button>
                {/* <Button
                    color="primary"
                    outline
                >
                            Обновить
                </Button> */}
            </CardBody>
        </Card>
    );
};
