import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { ButtonGroup, Button, CardGroup, Card, CardImg, CardBody, CardTitle, CardSubtitle, Spinner } from 'reactstrap';
import { getCandles, getInstruments } from '../../utils/instruments';
import { getPrice } from '../../utils/price';

import styles from '../../styles/Instruments.module.css';

// Голубые фишки
// Объём торгов внутри дня (ТОП-10)
// Волатильность внутри дня (ТОП-10)
// Фьючерсы

export default function Instruments(props) {
    const { setTitle, serverUri, brokerId } = props;

    React.useEffect(() => {
        setTitle('Инструменты');
    }, [setTitle]);

    return (<SelectInstrument
        serverUri={serverUri}
        brokerId={brokerId}
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
        page: 'shares',
        name: 'Акции',
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
    const { serverUri, brokerId } = props;

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
                {instrumentsButtons.map((i, k) => (
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
            {/* <br></br>
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
            </ButtonGroup> */}
            <br></br>
            {
                inProgress ? (
                    <center><Spinner color="primary">
                        Loading...
                    </Spinner></center>
                ) : instrumenst && instrumenst.instruments ? (
                    <>
                        <GroupInstruments
                            instrumenst={instrumenst.instruments}
                            serverUri={serverUri}
                            brokerId={brokerId}
                        />
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
                brokerId={props.brokerId}
                key={k}
                serverUri={props.serverUri}
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
    const { brokerId } = props;
    const router = useRouter();
    const {
        serverUri,
        figi,
        name,
    } = props;

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
                <CardTitle
                    tag="h5"
                    onClick={() => {
                        router.push('/instruments/' + figi);
                    }}
                    style={{
                        cursor: 'pointer',
                        color: '#002060',
                    }}
                    title="Открыть терминал"
                >
                    {name}
                </CardTitle>
                <CardSubtitle
                    className="mb-2 text-muted"
                    tag="h6"
                >
                    {brokerId === 'FINAM' ? '' : figi}
                </CardSubtitle>
                {/* <CardText>История (5 мин):</CardText> */}
                <FigiBlock
                    serverUri={serverUri}
                    figi={figi}
                />
                {/* <Button
                    color="primary"
                    outline
                    onClick={() => {
                        router.push('/instruments/' + props.figi);
                    }}
                >
                    Терминал
                </Button> */}
            </CardBody>
        </Card>
    );
};

const canvasWidth = 200;
const canvasHeight = 50;
const queue = {};

const FigiBlock = props => {
    const {
        serverUri,
        figi,
    } = props;

    const [data, setData] = useState();

    const getChart = useCallback(async () => {
        const to = new Date();
        const from = new Date(to - (6 * 24 * 3600 * 1000));

        const c = await getCandles(serverUri, figi, 4, from, to);

        if (c && c.candles && c.candles.length) {
            let max = getPrice(c.candles[0].high);
            let min = getPrice(c.candles[0].low);

            c.candles.forEach(c => {
                max = Math.max(getPrice(c.high), max);
                min = Math.min(getPrice(c.low), min);
            });

            const step = Math.floor(canvasWidth / c.candles.length);
            const hStep = (max - min);

            const d = c.candles.map((c, k) => {
                return [
                    k * step,
                    (1 - (getPrice(c.close) - min) / hStep) * canvasHeight,

                    // Точки для квадратичной кривой.
                    (1 - (getPrice(c.high) - min) / hStep) * canvasHeight,
                    (1 - (getPrice(c.low) - min) / hStep) * canvasHeight,

                    // Начальная точка отрисовки
                    (1 - (getPrice(c.open) - min) / hStep) * canvasHeight,
                ];
            });

            d[d.length - 1][0] = canvasWidth;

            setData(d);
        } else {
            setData([]);
        }

        queue[figi] = 1;
    }, [figi, serverUri]);

    useEffect(() => {
        if (typeof queue[figi] === 'undefined') {
            queue[figi] = 0;
        }

        const i = setInterval(async () => {
            const needGetChart = false;

            for (const q in queue) {
                if (queue[q] === 2) {
                    needGetChart = false;
                    break;
                } else if (!queue[q] && q === figi) {
                    needGetChart = q;
                } else if (queue[q] && q === figi) {
                    clearInterval(i);
                }
            }

            if (needGetChart) {
                queue[needGetChart] = 2;
                await getChart();
            }
        }, 1000);

        return () => {
            clearInterval(i);
        };
    }, [figi, getChart]);

    return (
        <div
            className={data ? styles.EmptyBlockFilled : styles.EmptyBlock}
            onClick={getChart}
        >
            { data ? (
                <ChartCanvas
                    data={data}
                />
            ) : 'Клик для загрузки' }
        </div>
    );
};

const ChartCanvas = props => {
    const {
        data,
    } = props;

    const canvasRef = useRef();

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        const startY = data.length && data[0][4];

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.beginPath();
        ctx.strokeStyle = startY <= (data.length && data[data.length - 1][1]) ? 'red' : 'green';
        ctx.moveTo(0, startY);

        for (let i = 1; i < data.length; i++) {
            const x = data[i][0];

            const cp1X = Math.round((data[i - 1][0] + x) / 2);
            let cp1Y;

            // Если дата закрытия выше прошлого
            if (data[i][1] >= data[i - 1][1]) {
                // Корректируем через high
                cp1Y = data[i][2];
            } else {
                cp1Y = data[i][3];
            }

            ctx.quadraticCurveTo(
                cp1X,
                cp1Y,
                x,
                data[i][1],
            );
        }

        ctx.stroke();
    }, [data]);

    return (
        <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
        />
    );
};
