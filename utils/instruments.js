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

export {
    getInstruments,
    getInstrument,
};
