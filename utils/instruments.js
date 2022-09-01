const requestOptions = {
    cache: 'no-cache',
    'Content-Type': 'application/json',
};

const getInstruments = async (url, page) => {
    let response;

    try {
        response = await window.fetch(`${url}/${page}`, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const getInstrument = async (url, figi) => {
    let response;

    try {
        response = await window.fetch(`${url}/figi/${figi}`, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const getFinamInstrument = async (url, figi) => {
    let response;

    try {
        response = await window.fetch(`${url}/seccode/${figi}`, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const getCandles = async (url, figi, interval, from, to, brokerId) => { // eslint-disable-line max-params
    let response;

    // Если отсутствует to, тогда запрашиваем за текущий день из from.
    if (!to) {
        to = new Date(from);
        from.setHours(5, 0, 0, 0);
        to.setHours(20, 59, 59, 999);
    }

    try {
        const page = brokerId === 'FINAM' ? 'getfinamcandles' : 'getcandles';

        response = await window.fetch(`${url}/${page}/${figi}?interval=${interval}&from=${from.getTime()}&to=${to.getTime()}`,
            requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const getLastPriceAndOrderBook = async (url, figi) => {
    let response;

    try {
        response = await window.fetch(`${url}/getlastpriceandorderbook/${figi}`,
            requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const getFinamOrderBook = async (url, figi, time) => {
    let response;

    try {
        response = await window.fetch(`${url}/getfinamorderbook/${figi}` + (time ? `?time=${time}` : ''),
            requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const getOrderBook = async (url, figi, time) => {
    let response;

    url = `${url}/getcachedorderbook/${figi}` + (time ? `?time=${time}` : '');

    try {
        response = await window.fetch(url,
            requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const getTradingSchedules = async (url, exchange, from, to) => {
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
        response = await window.fetch(`${url}/tradingschedules?${params}`, requestOptions);
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

    getOrderBook,
    getLastPriceAndOrderBook,
    getFinamInstrument,

    getFinamOrderBook,
};
