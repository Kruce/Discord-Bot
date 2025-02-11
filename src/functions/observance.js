const { log, dateTimeNowOffset } = require('../functions/utility');

function cambodianNewYearEmoji() {
    const year = new Date().getFullYear();
    const key = ((year - 4) % 12);
    const emojis = [`🐀`, `🐂`, `🐅`, `🐇`, `🐉`, `🐍`, `🐎`, `🐐`, `🐒`, `🐓`, `🐕`, `🐖`];
    return emojis[key];
}

// type: 0 keys are gregorian observances formatted as "month (using zero based), occurrence (or week), day of the week". Use -1 for `last`, such as `the last monday of month` in the occurrence and zero starts sunday for day of week
// type: 1 keys are gregorian observances formatted as "month (using zero based), day of the month" 
// type: 2 keys are islamic observances formatted as "day, islamic month"
const observances = [
    { type: 0, key: "0,3,1", values: [[`☮️`, `Martin Luther King Jr. day`, `https://en.wikipedia.org/wiki/Martin_Luther_King_Jr._Day`]] },
    { type: 0, key: "1,3,1", values: [[`🎩`, `President's day`, `https://en.wikipedia.org/wiki/Washington%27s_Birthday`]] },
    { type: 0, key: "2,2,0", values: [[`🌞`, `Daylight savings time begins`, `https://en.wikipedia.org/wiki/Daylight_saving_time_in_the_United_States`]] },
    { type: 0, key: "4,-1,1", values: [[`🎖️`, `Memorial day`, `https://en.wikipedia.org/wiki/Memorial_Day`]] },
    { type: 0, key: "8,1,1", values: [[`🔨`, `Labor day`, `https://en.wikipedia.org/wiki/Labor_Day`]] },
    { type: 0, key: "9,2,1", values: [
        [`🍁`, `Thanksgiving (Canada)`, `https://en.wikipedia.org/wiki/Thanksgiving_(Canada)`],
        [`🌄`, `Indigenous Peoples' Day`, `https://en.wikipedia.org/wiki/Indigenous_Peoples%27_Day_(United_States)`]
    ] },
    { type: 0, key: "10,1,0", values: [[`🌝`, `Daylight savings time ends`, `https://en.wikipedia.org/wiki/Daylight_saving_time_in_the_United_States`]] },
    { type: 0, key: "10,4,4", values: [[`🦃`, `Thanksgiving`, `https://en.wikipedia.org/wiki/Thanksgiving_(United_States)`]] },
    { type: 1, key: "0,1", values: [[`🎉`, `New years day`, `https://en.wikipedia.org/wiki/New_Year%27s_Day`]] },
    { type: 1, key: "1,1", values: [[`🙌🏿`, `Black history month begins`, `https://en.wikipedia.org/wiki/Black_History_Month`]] },
    { type: 1, key: "1,2", values: [[`🐿️`, `Groundhog day`, `https://en.wikipedia.org/wiki/Groundhog_Day`]] },
    { type: 1, key: "1,14", values: [[`💘`, `Valentine's day`, `https://en.wikipedia.org/wiki/Valentine%27s_Day`]] },
    { type: 1, key: "2,17", values: [[`☘️`, `St. Patrick's day`, `https://en.wikipedia.org/wiki/Saint_Patrick%27s_Day`]] },
    { type: 1, key: "2,30", values: [[`🌱`, `Land day`, `https://en.wikipedia.org/wiki/Land_Day`]] },
    { type: 1, key: "3,13", values: [[cambodianNewYearEmoji(), `Cambodian new year begins`, `https://en.wikipedia.org/wiki/Cambodian_New_Year`]] },
    { type: 1, key: "3,22", values: [[`🌎`, `Earth day`, `https://en.wikipedia.org/wiki/Earth_Day`]] },
    { type: 1, key: "3,24", values: [[`🇦🇲`, `Armenian genocide rememberence day`, `https://en.wikipedia.org/wiki/Armenian_Genocide_Remembrance_Day`]] },
    { type: 1, key: "4,5", values: [[`💃`, `Cinco de mayo`, `https://en.wikipedia.org/wiki/Cinco_de_Mayo`]] },
    { type: 1, key: "4,15", values: [[`🇵🇸`, `Nakba day`, `https://en.wikipedia.org/wiki/Nakba_Day`]] },
    { type: 1, key: "5,1", values: [[`🏳️‍🌈`, `Pride month begins`, `https://en.wikipedia.org/wiki/Gay_pride#LGBT_Pride_Month`]] },
    { type: 1, key: "5,19", values: [[`✊🏿`, `Juneteenth`, `https://en.wikipedia.org/wiki/Juneteenth`]] },
    { type: 1, key: "6,1", values: [[`🇨🇦`, `Canada day`, `https://en.wikipedia.org/wiki/Canada_Day`]] },
    { type: 1, key: "6,4", values: [[`🎆`, `Independence day (United States)`, `https://en.wikipedia.org/wiki/Independence_Day_(United_States)`]] },
    { type: 1, key: "7,26", values: [[`💪`, `Women's equality day`, `https://en.wikipedia.org/wiki/Women%27s_Equality_Day`]] },
    { type: 1, key: "9,31", values: [[`🎃`, `Halloween`, `https://en.wikipedia.org/wiki/Halloween`]] },
    { type: 1, key: "11,25", values: [[`🎄`, `Christmas`, `https://en.wikipedia.org/wiki/Christmas`]] },
    { type: 1, key: "11,26", values: [[`🕯️`, `Kwanzaa begins`, `https://en.wikipedia.org/wiki/Kwanzaa`]] },
    { type: 2, key: "1 Muharram", values: [[`☪️`, `Islamic new year`, `https://en.wikipedia.org/wiki/Islamic_New_Year`]] },
    { type: 2, key: "12 Rabi'ul Awwal", values: [[`🎂`, `Mawlid`, `https://en.wikipedia.org/wiki/Mawlid`]] },
    { type: 2, key: "1 Ramadan", values: [[`🌙`, `Ramadan begins`, `https://en.wikipedia.org/wiki/Ramadan`]] },
    { type: 2, key: "1 Shawwal", values: [[`😋`, `Eid Al-Fitr`, `https://en.wikipedia.org/wiki/Eid_al-Fitr`]] },
    { type: 2, key: "10 Dhul Hijja", values: [[`🐑`, `Eid Al-Adha begins`, `https://en.wikipedia.org/wiki/Eid_al-Adha`]] }
];

const gmod = (n, m) => {
    return ((n % m) + m) % m;
}

const kuwaitiCalendar = (date, adjust) => {
    if (adjust) {
        adjustmili = 1000 * 60 * 60 * 24 * adjust;
        todaymili = date.getTime() + adjustmili;
        date = new Date(todaymili);
    }

    day = date.getDate();
    month = date.getMonth();
    year = date.getFullYear();

    m = month + 1;
    y = year;
    if (m < 3) {
        y -= 1;
        m += 12;
    }

    a = Math.floor(y / 100.);
    b = 2 - a + Math.floor(a / 4.);
    if (y < 1583) b = 0;
    if (y == 1582) {
        if (m > 10) b = -10;
        if (m == 10) {
            b = 0;
            if (day > 4) b = -10;
        }
    }

    jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;

    b = 0;
    if (jd > 2299160) {
        a = Math.floor((jd - 1867216.25) / 36524.25);
        b = 1 + a - Math.floor(a / 4.);
    }
    bb = jd + b + 1524;
    cc = Math.floor((bb - 122.1) / 365.25);
    dd = Math.floor(365.25 * cc);
    ee = Math.floor((bb - dd) / 30.6001);
    day = (bb - dd) - Math.floor(30.6001 * ee);
    month = ee - 1;
    if (ee > 13) {
        cc += 1;
        month = ee - 13;
    }
    year = cc - 4716;

    if (adjust) {
        wd = gmod(jd + 1 - adjust, 7) + 1;
    } else {
        wd = gmod(jd + 1, 7) + 1;
    }

    iyear = 10631. / 30.;
    epochastro = 1948084;
    epochcivil = 1948085;

    shift1 = 8.01 / 60.;

    z = jd - epochastro;
    cyc = Math.floor(z / 10631.);
    z = z - 10631 * cyc;
    j = Math.floor((z - shift1) / iyear);
    iy = 30 * cyc + j;
    z = z - Math.floor(j * iyear + shift1);
    im = Math.floor((z + 28.5001) / 29.5);
    if (im == 13) im = 12;
    id = z - Math.floor(29.5001 * im - 29);

    var myRes = new Array(8);

    myRes[0] = day; //calculated day (CE)
    myRes[1] = month - 1; //calculated month (CE)
    myRes[2] = year; //calculated year (CE)
    myRes[3] = jd - 1; //julian day number
    myRes[4] = wd - 1; //weekday number
    myRes[5] = id; //islamic date
    myRes[6] = im - 1; //islamic month
    myRes[7] = iy; //islamic year

    return myRes;
}

const islamicDate = (date, adjustment) => {
    let monthNames = new Array(`Muharram`, `Safar`, `Rabi'ul Awwal`, `Rabi'ul Akhir`, `Jumadal Ula`, `Jumadal Akhira`, `Rajab`, `Sha'ban`, `Ramadan`, `Shawwal`, `Dhul Qa'ada`, `Dhul Hijja`);
    let iDate = kuwaitiCalendar(date, adjustment);
    return iDate[5] + " " + monthNames[iDate[6]];
}

/**
 * @param {number} startDate Day of the month to start at.
 * @param {number} dayOfWeek Day of the week that startDate falls on.
 * @param {number} endDate Day of the month to end at.
 * @param {number} dayOfWeekCount Day of the week to count between startDate and endDate.
 */
const occurrenceOfWeekDay = (startDate, dayOfWeek, endDate, dayOfWeekCount) => {
    let total = 0;
    for (let currentDay = startDate; currentDay <= endDate; ++currentDay) {
        if (dayOfWeek == dayOfWeekCount) ++total;
        (dayOfWeek < 6) ? ++dayOfWeek : dayOfWeek = 0; //if day of the week is less than 6 (before Saturday) increment, otherwise set the next to 0 (Sunday) instead
    }
    return total;
}

/**
 * Check whether today's date is any observance and return an observance array indicating observances as [`observance emoji`, `observance name`, `observance link`].
 */
const observancesToday = () => {
    const date = dateTimeNowOffset(process.env.HOUR_OFFSET); //update hours to est from server time
    log(`ObservancesToday function date/time requested: ${date}`, "info");
    const currentYear = date.getFullYear(); //extract current date info
    const currentMonth = date.getMonth();
    const currentDayOfWeek = date.getDay();
    const currentDayOfMonth = date.getDate();

    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); //get the week day of the first day of the month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); //get the last day of the month for the current month

    const occurrence = occurrenceOfWeekDay(1, firstDayOfWeek, currentDayOfMonth, currentDayOfWeek); //get total occurrence of the current date's day from the 1st up to the current date for the month 
    const totalOccurrence = occurrenceOfWeekDay(1, firstDayOfWeek, lastDayOfMonth, currentDayOfWeek); //get total occurrence of the current date's day from the 1st in the entire month 

    let observancesToday = []; //create new observance array and add all observance emojis if they exist in our predefined arrays
    
    let keys = [
        { type: 0, key: `${currentMonth},${occurrence},${currentDayOfWeek}` },
        { type: 1, key: `${currentMonth},${currentDayOfMonth}` },
        { type: 2, key: `${islamicDate(date, -1)}` }
    ];

    //if today is the last occurence of this day in the month, check for those observances using -1 that was described in the observances multidimensional array above
    if (occurrence == totalOccurrence) 
        keys.push({ type: 0, key: `${currentMonth},-1,${currentDayOfWeek}`});

    for (let i = 0; i < keys.length; ++i) {
        const values = observances.find(o => o.type == keys[i].type && o.key === keys[i].key)?.values;
        if (values !== undefined) {
            for (let x = 0; x < values.length; ++x) {
                observancesToday.push(values[x]);
            }
        }
    }

    return observancesToday;
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
    observancesToday,
    observanceEmojisToday
};