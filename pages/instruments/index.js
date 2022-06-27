import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { ButtonGroup, Button, CardGroup, Card, CardImg, CardBody, CardTitle, CardSubtitle, Spinner } from 'reactstrap';
import { getInstruments } from '../../utils/instruments';

// Голубые фишки
// Объём торгов внутри дня (ТОП-10)
// Волатильность внутри дня (ТОП-10)
// Фьючерсы

export default function Instruments(props) {
    const { setTitle, serverUri } = props;

    React.useEffect(() => {
        setTitle('Инструменты');
    }, [setTitle]);

    return (<SelectInstrument
        serverUri={serverUri}
    />);
}

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
        page: 'etfs',
        name: 'ETF',
    },

    // {
    //     page: 'bluechipsshares',
    //     name: 'Объём торгов внутри дня (ТОП-3)',
    // },
    // {
    //     page: 'bluechipsshares',
    //     name: 'Волатильность внутри дня (ТОП-3)',
    // },
];

const SelectInstrument = props => {
    const { serverUri } = props;

    const [buttonActive, setButtonActive] = useState();
    const [inProgress, setInprogress] = useState(false);
    const [instrumenst, setInstrumenst] = useState();
    const [isReady, setIsReady] = useState();

    const onButtonClick = React.useCallback(async num => {
        setButtonActive(num);
        setInprogress(true);
        setInstrumenst(await getInstruments(serverUri, instrumentsButtons[num].page));
        setInprogress(false);
    }, [serverUri]);

    useEffect(() => {
        setIsReady(true);
        if (isReady) {
            onButtonClick(0);
        }
    }, [isReady, onButtonClick]);

    return (
        <>
            <ButtonGroup>
                {instrumentsButtons.slice(0, 2).map((i, k) => (
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
                {instrumentsButtons.slice(2, 4).map((i, k) => (
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

    props.instrumenst.sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        }

        return 0;
    }).forEach((i, k) => {
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
    const router = useRouter();

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
                    onClick={() => {
                        router.push('/instruments/' + props.figi);
                    }}
                >
                    Терминал
                </Button>
            </CardBody>
        </Card>
    );
};
