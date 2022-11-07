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
    if (!url) {
        return;
    }

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

const addToken = async (url, token, brokerId, password) => {
    let response;

    try {
        response = await window.fetch(`${url}/addtoken?token=${token}&brokerId=${brokerId}&password=${password}`, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const changePassword = async (url, token, brokerId, oldpassword, newpassword) => {
    let response;

    try {
        response = await window.fetch(`${url}/changepassword?token=${token}&brokerId=${brokerId}&oldpassword=${oldpassword}&newpassword=${newpassword}`,
            requestOptions);
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
        response = await window.fetch(url + '/getncheckselectedtoken', requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const getFinamAuthStatus = async url => {
    let response;

    try {
        response = await window.fetch(url + '/getfinamauthstatus', requestOptions);
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

const isToday = (date1, date2) => date1.toDateString() === date2.toDateString();
const timezoneDate = time => new Date(time).getTime() - (new Date().getTimezoneOffset() * 60000);
const withoutTimezoneDate = time => new Date(time).getTime() + (new Date().getTimezoneOffset() * 60000);

export {
    checkServer,
    getLogs,
    selectToken,
    getSelectedToken,
    addToken,
    changePassword,
    getTokens,
    delToken,
    isToday,
    timezoneDate,
    withoutTimezoneDate,

    getFinamAuthStatus,
};
