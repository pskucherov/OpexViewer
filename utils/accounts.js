const requestOptions = {
    cache: 'no-cache',
    'Content-Type': 'application/json',
};

const getAccounts = async serverUri => {
    let response;

    try {
        response = await window.fetch(serverUri + '/getaccounts', requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

const selectAccount = async (serverUri, id) => {
    let response;

    try {
        response = await window.fetch(serverUri + '/selectaccount?id=' + id, requestOptions);
    } catch (error) {
        return false;
    }

    if (response && response.ok) {
        return await response.json();
    }

    return false;
};

export {
    getAccounts,
    selectAccount,
};
