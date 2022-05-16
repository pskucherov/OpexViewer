"use strict";
exports.id = 982;
exports.ids = [982];
exports.modules = {

/***/ 7982:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "C$": () => (/* binding */ getTradingSchedules),
/* harmony export */   "SK": () => (/* binding */ getInstruments),
/* harmony export */   "mQ": () => (/* binding */ getInstrument),
/* harmony export */   "nx": () => (/* binding */ getLastPriceAndOrderBook),
/* harmony export */   "wO": () => (/* binding */ getCandles),
/* harmony export */   "zU": () => (/* binding */ getOrderBook)
/* harmony export */ });
const requestOptions = {
    cache: "no-cache",
    "Content-Type": "application/json"
};
const getInstruments = async (url, page)=>{
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
const getInstrument = async (url, figi)=>{
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
const getCandles = async (url, figi, interval, from, to)=>{
    let response;
    // Если отсутствует to, тогда запрашиваем за текущий день из from.
    if (!to) {
        to = new Date(from);
        from.setHours(5, 0, 0, 0);
        to.setHours(20, 59, 59, 999);
    }
    try {
        response = await window.fetch(`${url}/getcandles/${figi}?interval=${interval}&from=${from.getTime()}&to=${to.getTime()}`, requestOptions);
    } catch (error) {
        return false;
    }
    if (response && response.ok) {
        return await response.json();
    }
    return false;
};
const getLastPriceAndOrderBook = async (url, figi)=>{
    let response;
    try {
        response = await window.fetch(`${url}/getlastpriceandorderbook/${figi}`, requestOptions);
    } catch (error) {
        return false;
    }
    if (response && response.ok) {
        return await response.json();
    }
    return false;
};
const getOrderBook = async (url, figi, time)=>{
    let response;
    url = `${url}/getcachedorderbook/${figi}` + (time ? `?time=${time}` : "");
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
const getTradingSchedules = async (url, exchange, from, to)=>{
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



/***/ })

};
;