/**
 * Adds commas to a number and returns it as a string.
 * @param {number} number number to format.
 */
function CommaString(number) {
    if (!number) {
        return `?`;
    }
    else {
        let parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
}
/**
 * Rounds a number to the first non-zero decimal, or a minimum of two decimal places.
 * @param {number} number number to format.
 */
function DecimalString(number) {
    let log10 = number ? Math.floor(Math.log10(number)) : 0,
        div = log10 < 0 ? Math.pow(10, 1 - log10) : 100;
    numb = Math.round(number * div) / div;
    const dec = numb.toString().split('.')[1]
    if (dec == undefined) { //there is no decimal
        return (CommaString(Number(numb).toFixed(2)));
    }
    else {
        const len = dec && dec.length < 2 ? 2 : dec.length
        return (CommaString(Number(numb).toFixed(len)));
    }
}

module.exports = {
    CommaString,
    DecimalString
};