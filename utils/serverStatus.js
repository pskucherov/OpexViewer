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

const getTokens = async url => {
    let response;

    try {
        response = await window.fetch(url + '/gettokens', {
            cache: 'no-cache',
            'Content-Type': 'application/json',
        });
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
        response = await window.fetch(url + '/deltoken?token=' + token, {
            cache: 'no-cache',
            'Content-Type': 'application/json',
        });
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
    getTokens,
    delToken,
};
