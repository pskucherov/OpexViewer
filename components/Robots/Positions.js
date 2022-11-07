import React, { useCallback } from 'react';
import { Badge, ListGroup, ListGroupItem, CloseButton, Button } from 'reactstrap';
import { getPrice } from '../../utils/price';

import { closeOrders, closePosition } from '../../utils/robots';

export function Positions(props) {
    const {
        positions,
        orders,
        robotState,
        isBacktest,
        brokerId,
        serverUri,
        checkRobot,
        figi,
    } = props;

    const onClosePosition = useCallback(async p => {
        await closePosition(serverUri, figi, p.direction, p.quantityLots.units);
        await checkRobot();
    }, [serverUri, checkRobot, figi]);

    const onCloseOrder = useCallback(async transactionid => {
        await closeOrders(serverUri, brokerId, transactionid);
        await checkRobot();
    }, [serverUri, brokerId, checkRobot]);

    return (
        <div style={{ width: '450px', margin: '0 auto' }}>
            {positions && positions.length ? (
                <ListGroup>
                    <center><h3>{isBacktest ? 'Сделки' : 'Позиции'}</h3></center>
                    {positions.map((p, k) => <PositionsList
                        p={p}
                        key={k}
                        serverUri={serverUri}
                        brokerId={brokerId}
                        onCloseButton={() => {
                            onClosePosition(p);
                        }}
                    />)}
                    <br></br>
                    {positions.length >= 3 && <Button
                        color="primary"
                        outline
                        onClick={() => {
                            positions.forEach(p => {
                                onClosePosition(p);
                            });
                        }}
                    >
                        Закрыть всё
                    </Button>}
                </ListGroup>
            ) : ''}
            {orders && orders.length ? (
                <>
                    <br></br>
                    <center><h3>Заявки</h3></center>
                    {orders.map((o, k) => <Orders
                        o={o}
                        key={k}
                        serverUri={serverUri}
                        brokerId={brokerId}
                        onCloseButton={() => {
                            onCloseOrder(o.transactionid);
                        }}
                    />)}
                    <br></br>
                    {orders.length >= 3 && <Button
                        color="primary"
                        outline
                        onClick={() => {
                            orders.forEach(o => {
                                onCloseOrder(o.transactionid);
                            });
                        }}
                    >
                        Закрыть всё
                    </Button>}
                </>
            ) : ''}
        </div>
    );
}

function PositionsList(props) {
    const { p, brokerId, onCloseButton } = props;

    const lots = p.lots || p.quantityLots.units;
    const price = `${getPrice(p.averagePositionPrice).toFixed(2)}x${p.quantity.units}`;

    return (
        <ListGroupItem className="justify-content-between" style={{ textAlign: 'left' }}>
            Лоты: <b>{lots}</b>,{'\u00a0'}
            Цена: <b>{price}</b>

            {typeof p.direction !== 'undefined' && <>{'\u00a0\u00a0\u00a0'}<Badge
                pill
                color={p.direction === 1 ? 'success' : 'danger'}
            >
                {p.direction === 1 ? 'Покупка' : 'Продажа'}
            </Badge></>}
            {p.expectedYield && <>{'\u00a0\u00a0\u00a0'}<Badge
                pill
                color={getPrice(p.expectedYield) >= 0 ? 'success' : 'danger'}
            >
                {(getPrice(p.expectedYield) > 0 ? '+' : '') + (getPrice(p.expectedYield) * (brokerId === 'FINAM' ? 1 : lots)).toFixed(2)}
            </Badge></>}
            <CloseButton
                style={{
                    verticalAlign: 'middle',
                    marginLeft: '20px',
                }}
                onClick={onCloseButton}
            />
        </ListGroupItem>
    );
}
function Orders(props) {
    const { o, brokerId, onCloseButton } = props;

    return (
        <ListGroupItem className="justify-content-between">
            Лоты: <b>{o.lotsRequested || 0}</b>, Цена: <b>{getPrice(o.initialOrderPrice || 0).toFixed(2)}</b>
            {'\u00a0\u00a0\u00a0'}
            <Badge
                pill
                color={o.direction === 1 ? 'success' : 'danger'}
            >
                {o.direction === 1 ? 'Покупка' : 'Продажа'}
            </Badge>
            {brokerId === 'FINAM' &&
                <CloseButton
                    style={{
                        verticalAlign: 'middle',
                        marginLeft: '20px',
                    }}
                    onClick={onCloseButton}
                />
            }
        </ListGroupItem>
    );
}
