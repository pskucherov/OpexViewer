const storageName = 'opexviewer';

const getFromLS = param => {
    const data = window.localStorage.getItem(storageName);

    if (data) {
        const d = JSON.parse(data);

        if (param) {
            return d[param];
        }

        return d;
    }
};

const setToLS = (name, data) => {
    const lsData = getFromLS() || {};

    lsData[name] = data;
    window.localStorage.setItem(storageName, JSON.stringify(lsData));
};

const getFromSS = param => {
    const data = window.sessionStorage.getItem(storageName);

    if (data) {
        const d = JSON.parse(data);

        if (param) {
            return d[param];
        }

        return d;
    }
};

const setToSS = (name, data) => {
    const lsData = getFromSS() || {};

    lsData[name] = data;
    window.sessionStorage.setItem(storageName, JSON.stringify(lsData));
};

export {
    getFromLS,
    setToLS,
    getFromSS,
    setToSS,
};
