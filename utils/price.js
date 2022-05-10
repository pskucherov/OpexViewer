const getPrice = quotation => {
    if (quotation.nano) {
        return quotation.units + quotation.nano / 1e9;
    }

    return quotation.units;
};

export {
    getPrice,
};
