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
                {instrumentsButtons.filter(i => brokerId !== 'FINAM' || i.page !== 'etfs').map((i, k) => (
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
                            showCanvas={!buttonActive}
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
    const [portfolioGroup, setPortfolioGroup] = useState([]);

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
                isin={i.isin}
                brokerId={props.brokerId}
                key={k}
                serverUri={props.serverUri}
                showCanvas={props.showCanvas}
                setPortfolioGroup={setPortfolioGroup}
                portfolioGroup={portfolioGroup}
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

    const onButtonTerminalClick = useCallback(() => {
        location.href += `/portfolio/${portfolioGroup.join('|')}`;
    }, [portfolioGroup]);

    return (
        <>
            {group.map((g, k) => (
                <CardGroup key={k}>
                    {g}
                </CardGroup>
            ))}
            {portfolioGroup.length >= 1 && <center><Button
                color="primary"
                outline
                onClick={onButtonTerminalClick}
                style={{
                    marginTop: '2rem',
                    maxWidth: 200,
                }}
            >
                Открыть терминал
            </Button></center>}
        </>
    );
};

const CardInstrument = props => { // eslint-disable-line sonarjs/cognitive-complexity
    const {
        brokerId,
        showCanvas,
        portfolioGroup,
        setPortfolioGroup,
    } = props;

    const router = useRouter();
    const {
        serverUri,
        figi,
        name,
        isin,
    } = props;

    const usePortfoloiInvestment = brokerId === 'FINAM' && showCanvas;

    const [hideCard, setHideCard] = useState(false);
    const [price, setPrice] = useState();
    const [color, setColor] = useState();

    const onCardClick = useCallback(() => {
        if (portfolioGroup.includes(figi)) {
            setPortfolioGroup([...portfolioGroup].filter(f => f !== figi));
        } else if (portfolioGroup.length === 3) {
            setPortfolioGroup([...portfolioGroup.slice(1), figi].filter(f => Boolean(f)));
        } else {
            setPortfolioGroup([...portfolioGroup, figi].filter(f => Boolean(f)));
        }
    }, [portfolioGroup, setPortfolioGroup, figi]);

    return hideCard ? null : (
        <Card
            onClick={usePortfoloiInvestment ? onCardClick : undefined}
            color={usePortfoloiInvestment && portfolioGroup.includes(figi) ? 'info' : undefined}
            style={
                usePortfoloiInvestment ? {
                    cursor: 'pointer',
                } : undefined
            }
        >
            <CardBody>
                <CardTitle
                    tag="h5"
                    onClick={usePortfoloiInvestment ? undefined : () => {
                        router.push('/instruments/' + figi);
                    }}
                    style={{
                        cursor: 'pointer',
                        color: '#002060',
                    }}
                    title="Открыть терминал"
                >
                    {name}
                    {price && <span style={{
                        color: `${color}`,
                    }}> {price} ₽</span>}
                </CardTitle>
                <CardSubtitle
                    className="mb-2 text-muted"
                    tag="h6"
                >
                    {isin || ''}
                </CardSubtitle>
                {showCanvas ? <FigiBlock
                    serverUri={serverUri}
                    figi={figi}
                    brokerId={brokerId}
                    setHideCard={setHideCard}
                    setPrice={setPrice}
                    setColor={setColor}
                /> : <Button
                    color="primary"
                    outline
                    onClick={usePortfoloiInvestment ? undefined : () => {
                        router.push('/instruments/' + props.figi);
                    }}
                >
                    Терминал
                </Button>}
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
        brokerId,
        setHideCard,
        setPrice,
        setColor,
    } = props;

    const [data, setData] = useState();

    const getChart = useCallback(async () => {
        if (!brokerId) {
            return;
        }

        const to = new Date();
        const from = new Date(to - (6 * 24 * 3600 * 1000));

        const c = await getCandles(serverUri, figi, brokerId === 'FINAM' ? 1 : 4, from, to, brokerId);

        if (c && c.candles && c.candles.length) {
            let max = getPrice(c.candles[0].high);
            let min = getPrice(c.candles[0].low);

            c.candles.forEach(c => {
                max = Math.max(getPrice(c.high), max);
                min = Math.min(getPrice(c.low), min);
            });

            const step = (canvasWidth / c.candles.length);
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
            setPrice(c.candles[c.candles.length - 1].close);

            setData(d);
        } else {
            setData([]);
            setPrice();
            setHideCard(true);
        }
    }, [figi, serverUri, brokerId, setHideCard, setPrice]);

    useEffect(() => {
        let i;

        const getChartInterval = async () => {
            const timeout = parseInt(Math.random() * 1000, 10);

            i = setTimeout(async () => {
                await getChart();
                await getChartInterval();
            }, timeout);
        };

        (async () => {
            // await getChart();
            await getChartInterval();
        })();

        return () => {
            clearTimeout(i);
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
                    setColor={setColor}
                />
            ) : brokerId === 'FINAM' ? 'Здесь будет график' : 'Клик для загрузки' }
        </div>
    );
};

const ChartCanvas = props => {
    const {
        data,
        setColor,
    } = props;

    const canvasRef = useRef();

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        const startY = data.length && data[0][4];

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.beginPath();
        const color = startY <= (data.length && data[data.length - 1][1]) ? 'red' : 'green';

        ctx.strokeStyle = color;
        setColor(color);
        ctx.moveTo(0, startY);

        for (let i = 1; i < data.length; i++) {
            const x = data[i][0];

            const cp1X = (data[i - 1][0] + x) / 2;
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
    }, [data, setColor]);

    return (
        <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
        />
    );
};
