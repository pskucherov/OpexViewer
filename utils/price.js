const getPrice = quotation => {
    if (!quotation || typeof quotation !== 'object') {
        return parseFloat(quotation) || quotation;
    }

    if (quotation.nano) {
        return quotation.units + quotation.nano / 1e9;
    }

    return quotation.units || 0;
};

export {
    getPrice,
};
