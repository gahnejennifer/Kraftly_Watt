export const formatAmount = (amount) => {
    const hasDecimals = amount % 1 !== 0;
    if (amount === undefined) {
        return '-';
    }
    return amount.toLocaleString('sv-SE', { 
        minimumFractionDigits: hasDecimals ? 2 : 0, 
        maximumFractionDigits: 2 }) + ' kr'
}