const chalk = require("chalk");
const { observances, occurrenceOfWeekDay, islamicDate } = require("./functions/observances")

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

/**
 * Check whether today's date is any observance and return an observance array indicating observances as [`observance emoji`, `observance name`, `observance link`].
 */
const observancesToday = () => {
    const date = new Date();
    date.setHours(date.getHours() - 4); //update hours to est for coordinated universal time
    log(`ObservancesToday function date/time requested: ${date}`, "info");
    const currentYear = date.getFullYear(); //extract current date info
    const currentMonth = date.getMonth();
    const currentDayOfWeek = date.getDay();
    const currentDayOfMonth = date.getDate();

    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); //get the week day of the first day of the month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); //get the last day of the month for the current month

    const occurrence = occurrenceOfWeekDay(1, firstDayOfWeek, currentDayOfMonth, currentDayOfWeek); //get total occurrence of the current date's day from the 1st up to the current date for the month 
    const totalOccurrence = occurrenceOfWeekDay(1, firstDayOfWeek, lastDayOfMonth, currentDayOfWeek); //get total occurrence of the current date's day from the 1st in the entire month 

    let observance = []; //create new observance array and add all observance emojis if they exist in our predefined arrays
    let keys = [ //each array within this multidimensional array has two values. The first value is the key that is used to get the applicable observances sub-array in the 'observances' multidimensional array, and the second is today's generated key to check if any observances match within that sub-array
        [0, `${currentMonth},${occurrence},${currentDayOfWeek}`],
        [1, `${currentMonth},${currentDayOfMonth}`],
        [2, `${islamicDate(date, -1)}`],
    ];

    //if today is the last occurence of this day in the month, check for those observances using -1 that was described in the observances multidimensional array above
    if (occurrence == totalOccurrence) keys.push([0, `${currentMonth},-1,${currentDayOfWeek}`]);

    for (let i = 0; i < keys.length; ++i) { //for each of our keys, check their applicable observance array to see if any observances exist
        const array = observances[keys[i][0]];
        const key = keys[i][1];
        const values = array[key];
        if (values !== undefined) {
            for (let x = 0; x < values.length; ++x) {
                observance.push(values[x])
            }
        }
    }

    return observance;
}

/**
* Check whether today's date is any observance and return a string of all emojis indicating observances if any.
*/
const observanceEmojisToday = () => {
    const observance = observancesToday();
    let emojis = ``;
    for (let i = 0; i < observance.length; ++i) {
        emojis += observance[i][0];
    }
    return emojis;
}

module.exports = {
    log,
    time,
    isSnowflake,
    shuffleArray,
    commaString,
    decimalString,
    observancesToday,
    observanceEmojisToday
};