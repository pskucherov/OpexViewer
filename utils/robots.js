import { getPrice } from './price';

const requestOptions = {
    cache: 'no-cache',
    'Content-Type': 'application/json',
};

const getRobots = async serverUri => {
    let response;

    try {
        response = await window.fetch(serverUri + '/robots/getnames', requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const startRobot = async (serverUri, name, figi, selectedDate, interval, backtest, isAdviser, accountId) => { // eslint-disable-line max-params
    let response;

    try {
        response = await window.fetch(serverUri +
            `/robots/start/${figi}?accountId=${accountId}&interval=${interval}&backtest=${Number(backtest)}
            &adviser=${Number(isAdviser)}&name=${name}&date=${selectedDate.getTime()}`, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const stepRobot = async (serverUri, step) => {
    let response;

    try {
        response = await window.fetch(serverUri +
            `/robots/backtest/step/${step}`, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const stopRobot = async (serverUri, name) => {
    let response;

    try {
        response = await window.fetch(serverUri +
            `/robots/stop/?name=${name}`, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const statusRobot = async serverUri => {
    let response;

    try {
        response = await window.fetch(serverUri +
            '/robots/status', requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const getRobotLogs = async (serverUri, name, accountId, figi, date) => {
    let response;

    try {
        response = await window.fetch(serverUri +
            `/robots/logs/${figi}?name=${name}&accountId=${accountId}&date=${date}`, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const robotFlagsForChart = (chartOptions, robotState, styles) => {
    const orders = [];
    const trades = [];

    if (robotState) {
        robotState.forEach(s => {
            if (s.orderId) {
                orders.push(s);
            } else if (s.orderTrades) {
                s.orderTrades.trades.forEach(t => trades.push({
                    ...s.orderTrades,
                    ...t,
                    logOrderTime: s.logOrderTime,
                }));
            }
        });
    }

    const buyFlags1 = trades && trades.length ? {
        ...chartOptions.series[2],
        data: trades.filter(p => p.direction === 1).map(p => {
            return {
                title: `<div class="${styles.Arrow} ${styles.BuyArrow}">B<br>U<br>Y</div>`,
                text: `<b>Сделка</b><br>Цена: ${getPrice(p.price)}<br>Всего: ${(getPrice(p.price) * p.quantity).toFixed(2)}<br>Кол-во: ${p.quantity}`,
                x: p.logOrderTime,
            };
        }),
    } : undefined;

    const sellFlags1 = trades && trades.length ? {
        ...chartOptions.series[3],
        data: trades.filter(p => p.direction === 2).map(p => {
            return {
                title: `<div class="${styles.Arrow} ${styles.SellArrow}">S<br>E<br>L<br>L</div>`,
                text: `<b>Сделка</b><br>Цена: ${getPrice(p.price)}<br>Всего: ${(getPrice(p.price) * p.quantity).toFixed(2)}<br>Кол-во: ${p.quantity}`,
                x: p.logOrderTime,
            };
        }),
    } : undefined;

    const buyFlags2 = trades && trades.length ? {
        ...chartOptions.series[4],
        data: orders.filter(p => p.direction === 1).map(p => {
            return {
                title: `<div class="${styles.Arrow} ${styles.BuyArrow}">B<br>U<br>Y</div>`,
                text: `<b>Заявка</b><br>Цена: ${getPrice(p.initialSecurityPrice)}<br>Всего: ${(getPrice(p.initialOrderPrice))}`,
                x: p.logOrderTime,
            };
        }),
    } : undefined;

    const sellFlags2 = trades && trades.length ? {
        ...chartOptions.series[5],
        data: orders.filter(p => p.direction === 2).map(p => {
            return {
                title: `<div class="${styles.Arrow} ${styles.SellArrow}">S<br>E<br>L<br>L</div>`,
                text: `<b>Заявка</b><br>Цена: ${getPrice(p.initialSecurityPrice)}<br>Всего: ${(getPrice(p.initialOrderPrice))}`,
                x: p.logOrderTime,
            };
        }),
    } : undefined;

    return {
        buyFlags1,
        sellFlags1,
        buyFlags2,
        sellFlags2,
    };
};

export {
    getRobots,
    startRobot,
    stopRobot,
    stepRobot,
    statusRobot,
    getRobotLogs,
    robotFlagsForChart,
};
