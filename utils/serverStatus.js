const requestOptions = {
    cache: 'no-cache',
    'Content-Type': 'application/json',
};

/**
 * Проверка сервера, что доступен по ссылке.
 *
 * @param {String} url
 * @returns
 */
const checkServer = async url => {
    let response;

    try {
        response = await window.fetch(url + '/check', {
            cache: 'no-cache',
        });
    } catch {
        return false;
    }

    if (response && response.ok) {
        const json = await response.json();

        return Boolean(json && json.status);
    }

    return false;
};

const getLogs = async (url, type) => {
    let response;

    try {
        response = await window.fetch(url + `/logs/${type}`, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return response.text();
    }

    return false;
};

const addToken = async (url, token) => {
    let response;

    try {
        response = await window.fetch(url + '/addtoken?token=' + token, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const selectToken = async (url, token) => {
    let response;

    try {
        response = await window.fetch(url + '/selecttoken?token=' + token, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const getSelectedToken = async url => {
    let response;

    try {
        response = await window.fetch(url + '/getselectedtoken', requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const getTokens = async url => {
    let response;

    try {
        response = await window.fetch(url + '/gettokens', requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const delToken = async (url, token) => {
    let response;

    try {
        response = await window.fetch(url + '/deltoken?token=' + token, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

export {
    checkServer,
    getLogs,
    selectToken,
    getSelectedToken,
    addToken,
    getTokens,
    delToken,
};
