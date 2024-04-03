const chalk = require("chalk");

/**
 * Logs a message with optional styling.
 *
 * @param {string} string - The message to log.
 * @param {'info' | 'err' | 'warn' | 'done' | undefined} style - The style of the log.
 */
const log = (string, style) => {
    const styles = {
        info: { prefix: chalk.blue("[INFO]"), logFunction: console.log },
        err: { prefix: chalk.red("[ERROR]"), logFunction: console.error },
        warn: { prefix: chalk.yellow("[WARNING]"), logFunction: console.warn },
        done: { prefix: chalk.green("[SUCCESS]"), logFunction: console.log },
    };

    const selectedStyle = styles[style] || { logFunction: console.log };
    selectedStyle.logFunction(`${selectedStyle.prefix || ""} ${string}`);
};

/**
 * Formats a timestamp.
 *
 * @param {number} time - The timestamp in milliseconds.
 * @param {import('discord.js').TimestampStylesString} style - The timestamp style.
 * @returns {string} - The formatted timestamp.
 */
const time = (time, style) => {
    return `<t:${Math.floor(time / 1000)}${style ? `:${style}` : ""}>`;
};

/**
 * Whenever a string is a valid snowflake (for Discord).

 * @param {string} id 
 * @returns {boolean}
 */
const isSnowflake = (id) => {
    return /^\d+$/.test(id);
};

/**
* Shuffles all elements in an array.
* @param {Array} array an array of items
*/
const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

/**
 * Adds commas to a number and returns it as a string.
 * @param {number} number number to format.
 */
const commaString = (number) => {
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
const decimalString = (number) => {
    let log10 = number ? Math.floor(Math.log10(number)) : 0,
        div = log10 < 0 ? Math.pow(10, 1 - log10) : 100;
    numb = Math.round(number * div) / div;
    const dec = numb.toString().split('.')[1]
    let len = (!dec || dec.length < 2) ? 2 : dec.length
    return (commaString(Number(numb).toFixed(len)));
}

module.exports = {
    log,
    time,
    isSnowflake,
    shuffleArray,
    commaString,
    decimalString
};