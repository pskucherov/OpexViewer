import React from 'react';
import { Badge, ListGroup, ListGroupItem } from 'reactstrap';
import { getPrice } from '../../utils/price';

export function Positions(props) {
    const { positions, orders, robotState, isBacktest } = props;

    return (
        <div style={{ width: '400px', margin: '0 auto' }}>
            {positions && positions.length ? (
                <ListGroup>
                    <center><h3>{isBacktest ? 'Сделки' : 'Позиции'}</h3></center>
                    {positions.map((p, k) => {
                        const lots = p.lots || p.quantityLots.units;
                        const price = `${getPrice(p.averagePositionPrice).toFixed(2)}x${p.quantity.units}`;

                        return (
                            <ListGroupItem className="justify-content-between" style={{ textAlign: 'left' }} key={k}>
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
                                    {(getPrice(p.expectedYield) > 0 ? '+' : '') + (getPrice(p.expectedYield || 0) * lots).toFixed(2)}
                                </Badge></>}
                            </ListGroupItem>
                        );
                    })}
                </ListGroup>
            ) : ''}
            {orders && orders.length ? (
                <>
                    <br></br>
                    <center><h3>Заявки</h3></center>
                    {orders.map((o, k) => {
                        return (
                            <ListGroupItem className="justify-content-between" key={k}>
                            Лоты: <b>{o.lotsRequested}</b>, Цена: <b>{getPrice(o.initialOrderPrice).toFixed(2)}</b>
                                {'\u00a0\u00a0\u00a0'}
                                <Badge
                                    pill
                                    color={o.direction === 1 ? 'success' : 'danger'}
                                >
                                    {o.direction === 1 ? 'Покупка' : 'Продажа'}
                                </Badge>
                            </ListGroupItem>

                        );
                    })}
                </>
            ) : ''}
        </div>
    );
}
