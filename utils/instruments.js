const requestOptions = {
    cache: 'no-cache',
    'Content-Type': 'application/json',
};
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

export {
    getInstruments,
};
