import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';

import PriceIndicator from 'highcharts/modules/price-indicator';
import Accessibility from 'highcharts/modules/accessibility';
import { Container, Row, Col } from 'reactstrap';

import { OrderBook } from '../OrderBook/OrderBook';

import styles from '../../styles/Terminal.module.css';

export function Terminal(props) {
    const {
        data,
        inProgress,
        setInprogress,
        options,
        step,
        isBackTest,
        serverUri,
        interval,
        figi,
        robotSetting,
        brokerId,
    } = props;

    const refChart = React.useRef(null);

    React.useEffect(() => {
        PriceIndicator(Highcharts);
        Accessibility(Highcharts);
    }, []);

    return (!data.length || inProgress || !setInprogress) ? '' : (
        <Container fluid>
            <Row>
                <Col
                    className={`bg-light border w-auto ${styles.TerminalColChart}`}
                >
                    <HighchartsReact
                        ref={refChart}
                        highcharts={Highcharts}
                        constructorType={'stockChart'}
                        options={options}
                    />
                </Col>
                <Col
                    className={`bg-light border ${styles.TerminalColOrderBook}`}
                >
                    <OrderBook
                        brokerId={brokerId}
                        data={data}
                        step={step}
                        serverUri={serverUri}
                        interval={interval}
                        figi={figi}
                        robotSetting={robotSetting}

                        // setLastPriceInChart={setLastPriceInChart}
                        isBackTest={isBackTest}
                    />
                </Col>
            </Row>
        </Container>
    );
}
