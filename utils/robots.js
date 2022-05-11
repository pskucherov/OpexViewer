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

const statusRobot = async (serverUri, name) => {
    let response;

    try {
        response = await window.fetch(serverUri +
            `/robots/status/?name=${name}`, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

export {
    getRobots,
    startRobot,
    stopRobot,
    stepRobot,
    statusRobot,
};
