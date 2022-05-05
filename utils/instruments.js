const requestOptions = {
    cache: 'no-cache',
    'Content-Type': 'application/json',
};

// TODO: redux
const defaultServerUri = 'http://localhost:8000';

const getInstruments = async url => {
    let response;

    try {
        response = await window.fetch(url, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const getInstrument = async figi => {
    let response;

    try {
        response = await window.fetch(`${defaultServerUri}/figi/${figi}`, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const getCandles = async (figi, interval, from, to) => {
    let response;

    // Если отсутствует to, тогда запрашиваем за текущий день из from.
    if (!to) {
        to = new Date(from);
        from.setHours(5, 0, 0, 0);
        to.setHours(20, 59, 59, 999);
    }

    try {
        response = await window.fetch(`${defaultServerUri}/getcandles/${figi}?interval=${interval}&from=${from.getTime()}&to=${to.getTime()}`,
            requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const getTradingSchedules = async (exchange, from, to) => {
    let response;

    let params = `exchange=${exchange}&from=${from.getTime()}`;

    if (to) {
        params += `&to=${to.getTime()}`;
    } else {
        // Параметр to должен быть больше from.
        // В данном случае запрашивается для текущей даты.
        params += `&to=${from.getTime() + 1}`;
    }

    try {
        response = await window.fetch(`${defaultServerUri}/tradingschedules?${params}`, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

export {
    getInstruments,
    getInstrument,

    getTradingSchedules,
    getCandles,
};
