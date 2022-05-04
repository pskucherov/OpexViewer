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

const getTradingSchedules = async (exchange, from, to) => {
    let response;

    let params = `exchange=${exchange}&from=${from.getTime()}`;

    if (to) {
        params += `&to=${to.getTime()}`;
    } else {
        // Параметр to должен быть больше from.
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
};
