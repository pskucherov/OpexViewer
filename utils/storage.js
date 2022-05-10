const storageName = 'opexviewer';

const getFromLS = () => {
    const data = window.localStorage.getItem(storageName);

    if (data) {
        return JSON.parse(data);
    }

    return {};
};

const setToLS = (name, data) => {
    const lsData = getFromLS();

    lsData[name] = data;
    window.localStorage.setItem(storageName, JSON.stringify(lsData));
};

const getFromSS = () => {
    const data = window.sessionStorage.getItem(storageName);

    if (data) {
        return JSON.parse(data);
    }

    return {};
};

const setToSS = (name, data) => {
    const lsData = getFromSS();

    lsData[name] = data;
    window.sessionStorage.setItem(storageName, JSON.stringify(lsData));
};

export {
    getFromLS,
    setToLS,
    getFromSS,
    setToSS,
};
