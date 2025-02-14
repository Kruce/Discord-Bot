const { log, dateTimeNowOffset } = require('../functions/utility');

// type: 0 keys are gregorian observances formatted as "month (using zero based), occurrence (or week), day of the week". Use -1 for `last`, such as `the last monday of month` in the occurrence and zero starts sunday for day of week
// type: 1 keys are gregorian observances formatted as "month (using zero based), day of the month" 
// type: 2 keys are islamic observances formatted as "day, islamic month"
// type: 3 keys are dates that need to be calculated first and returned as .toDateString()
const observances = [
    { type: 0, key: function () { return "0,3,1"; }, values: [{ name: `Martin Luther King Jr. day`, link: `https://en.wikipedia.org/wiki/Martin_Luther_King_Jr._Day`, emojis: function () { return getEmoji([`☮️`]) } }] },
    { type: 0, key: function () { return "1,3,1"; }, values: [{ name: `President's day`, link: `https://en.wikipedia.org/wiki/Washington%27s_Birthday`, emojis: function () { return getEmoji([`🎩`]) } }] },
    { type: 0, key: function () { return "2,2,0"; }, values: [{ name: `Daylight savings time begins`, link: `https://en.wikipedia.org/wiki/Daylight_saving_time_in_the_United_States`, emojis: function () { return getEmoji([`🌞`, `🌻`]) } }] },
    { type: 0, key: function () { return "4,-1,1"; }, values: [{ name: `Memorial day`, link: `https://en.wikipedia.org/wiki/Memorial_Day`, emojis: function () { return getEmoji([`🎖️`, `🪖`]) } }] },
    { type: 0, key: function () { return "8,1,1"; }, values: [{ name: `Labor day`, link: `https://en.wikipedia.org/wiki/Labor_Day`, emojis: function () { return getEmoji([`🔨`, `🛠`]) } }] },
    {
        type: 0, key: function () { return "9,2,1"; }, values: [
            { name: `Thanksgiving (Canada)`, link: `https://en.wikipedia.org/wiki/Thanksgiving_(Canada)`, emojis: function () { return getEmoji([`🍁`]) } },
            { name: `Indigenous Peoples' Day`, link: `https://en.wikipedia.org/wiki/Indigenous_Peoples%27_Day_(United_States)`, emojis: function () { return getEmoji([`🌄`]) } }
        ]
    },
    { type: 0, key: function () { return "10,1,0"; }, values: [{ name: `Daylight savings time ends`, link: `https://en.wikipedia.org/wiki/Daylight_saving_time_in_the_United_States`, emojis: function () { return getEmoji([`🌝`, `🍂`]) } }] },
    { type: 0, key: function () { return "10,4,4"; }, values: [{ name: `Thanksgiving`, link: `https://en.wikipedia.org/wiki/Thanksgiving_(United_States)`, emojis: function () { return getEmoji([`🦃`, `🌽`, `🌰`, `🍗`, `🥧`]) } }] },
    { type: 1, key: function () { return "0,1"; }, values: [{ name: `New years day`, link: `https://en.wikipedia.org/wiki/New_Year%27s_Day`, emojis: function () { return getEmoji([`🎉`, `🍾`, `🎆`, `🎊`, `🥂`]) } }] },
    { type: 1, key: function () { return "1,1"; }, values: [{ name: `Black history month begins`, link: `https://en.wikipedia.org/wiki/Black_History_Month`, emojis: function () { return getEmoji([`🙌🏿`, `🙌🏾`]) } }] },
    { type: 1, key: function () { return "1,2"; }, values: [{ name: `Groundhog day`, link: `https://en.wikipedia.org/wiki/Groundhog_Day`, emojis: function () { return getEmoji([`🐿️`]) } }] },
    { type: 1, key: function () { return "1,14"; }, values: [{ name: `Valentine's day`, link: `https://en.wikipedia.org/wiki/Valentine%27s_Day`, emojis: function () { return getEmoji([`💘`, `💋`, `🌹`, `💕`, `💝`]) } }] },
    { type: 1, key: function () { return "2,17"; }, values: [{ name: `St. Patrick's day`, link: `https://en.wikipedia.org/wiki/Saint_Patrick%27s_Day`, emojis: function () { return getEmoji([`☘️`, `🍻`, `🍀`, `🍺`]) } }] },
    { type: 1, key: function () { return "2,30"; }, values: [{ name: `Land day`, link: `https://en.wikipedia.org/wiki/Land_Day`, emojis: function () { return getEmoji([`🌱`]) } }] },
    { type: 1, key: function () { return "3,13"; }, values: [{ name: `Cambodian new year begins`, link: `https://en.wikipedia.org/wiki/Cambodian_New_Year`, emojis: function () { return getKhmerOrChineseZodiacAnimalEmoji() } }] },
    { type: 1, key: function () { return "3,22"; }, values: [{ name: `Earth day`, link: `https://en.wikipedia.org/wiki/Earth_Day`, emojis: function () { return getEmoji([`🌎`, `🌍`, `🌏`, `🗺️`]) } }] },
    { type: 1, key: function () { return "3,24"; }, values: [{ name: `Armenian genocide rememberence day`, link: `https://en.wikipedia.org/wiki/Armenian_Genocide_Remembrance_Day`, emojis: function () { return getEmoji([`🇦🇲`]) } }] },
    { type: 1, key: function () { return "4,5"; }, values: [{ name: `Cinco de mayo`, link: `https://en.wikipedia.org/wiki/Cinco_de_Mayo`, emojis: function () { return getEmoji([`💃`, `🇲🇽`, `🪅`]) } }] },
    { type: 1, key: function () { return "4,15"; }, values: [{ name: `Nakba day`, link: `https://en.wikipedia.org/wiki/Nakba_Day`, emojis: function () { return getEmoji([`🇵🇸`]) } }] },
    { type: 1, key: function () { return "5,1"; }, values: [{ name: `Pride month begins`, link: `https://en.wikipedia.org/wiki/Gay_pride#LGBT_Pride_Month`, emojis: function () { return getEmoji([`🏳️‍🌈`, `🌈`]) } }] },
    { type: 1, key: function () { return "5,19"; }, values: [{ name: `Juneteenth`, link: `https://en.wikipedia.org/wiki/Juneteenth`, emojis: function () { return getEmoji([`✊🏿`, `⛓️‍💥`]) } }] },
    { type: 1, key: function () { return "6,1"; }, values: [{ name: `Canada day`, link: `https://en.wikipedia.org/wiki/Canada_Day`, emojis: function () { return getEmoji([`🇨🇦`]) } }] },
    { type: 1, key: function () { return "6,4"; }, values: [{ name: `Independence day (United States)`, link: `https://en.wikipedia.org/wiki/Independence_Day_(United_States)`, emojis: function () { return getEmoji([`🎆`, `🎇`, `🇺🇸`, `🗽`, `🦅`]) } }] },
    { type: 1, key: function () { return "7,26"; }, values: [{ name: `Women's equality day`, link: `https://en.wikipedia.org/wiki/Women%27s_Equality_Day`, emojis: function () { return getEmoji([`💪`, `♀️`]) } }] },
    { type: 1, key: function () { return "9,31"; }, values: [{ name: `Halloween`, link: `https://en.wikipedia.org/wiki/Halloween`, emojis: function () { return getEmoji([`🎃`, `👻`, `💀`, `🦇`, `🍬`, `🕷️`]) } }] },
    { type: 1, key: function () { return "11,25"; }, values: [{ name: `Christmas`, link: `https://en.wikipedia.org/wiki/Christmas`, emojis: function () { return getEmoji([`🎅`, `🎄`, `🤶`, `🎁`, `⛄`, `☃️`]) } }] },
    { type: 1, key: function () { return "11,26"; }, values: [{ name: `Kwanzaa begins`, link: `https://en.wikipedia.org/wiki/Kwanzaa`, emojis: function () { return getEmoji([`🕯️`]) } }] },
    { type: 2, key: function () { return "1 Muharram"; }, values: [{ name: `Islamic new year`, link: `https://en.wikipedia.org/wiki/Islamic_New_Year`, emojis: function () { return getEmoji([`☪️`]) } }] },
    { type: 2, key: function () { return "12 Rabi'ul Awwal"; }, values: [{ name: `Mawlid`, link: `https://en.wikipedia.org/wiki/Mawlid`, emojis: function () { return getEmoji([`🎂`]) } }] },
    { type: 2, key: function () { return "1 Ramadan"; }, values: [{ name: `Ramadan begins`, link: `https://en.wikipedia.org/wiki/Ramadan`, emojis: function () { return getEmoji([`🌙`, `🕌`]) } }] },
    { type: 2, key: function () { return "1 Shawwal"; }, values: [{ name: `Eid Al-Fitr`, link: `https://en.wikipedia.org/wiki/Eid_al-Fitr`, emojis: function () { return getEmoji([`😋`]) } }] },
    { type: 2, key: function () { return "10 Dhul Hijja"; }, values: [{ name: `Eid Al-Adha begins`, link: `https://en.wikipedia.org/wiki/Eid_al-Adha`, emojis: function () { return getEmoji([`🐑`]) } }] },
    { type: 3, key: function () { return getLunarNewYear(); }, values: [{ name: `Lunar New Year begins`, link: `https://en.wikipedia.org/wiki/Lunar_New_Year`, emojis: function () { return `🧧${getKhmerOrChineseZodiacAnimalEmoji()}`; } }] }
];

const getKhmerOrChineseZodiacAnimalEmoji = () => {
    return [`🐀`, `🐂`, `🐅`, `🐇`, `🐉`, `🐍`, `🐎`, `🐐`, `🐒`, `🐓`, `🐕`, `🐖`][(new Date().getFullYear() - 4) % 12];
}

const getEmoji = (emojis) => {
    return emojis[Math.floor(Math.random() * emojis.length)];
}

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

const getNewMoons = (date) => {
    const LUNAR_MONTH = 29.5305888531
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()

    if (m <= 2) {
        y -= 1
        m += 12
    }
    a = Math.floor(y / 100)
    b = Math.floor(a / 4)
    c = 2 - a + b
    e = Math.floor(365.25 * (y + 4716))
    f = Math.floor(30.6001 * (m + 1))
    julianDay = c + d + e + f - 1524.5
    daysSinceLastNewMoon = julianDay - 2451549.5
    newMoons = daysSinceLastNewMoon / LUNAR_MONTH
    daysIntoCycle = (newMoons % 1) * LUNAR_MONTH
    return newMoons
}

const inLunarNewYear = (date) => {
    return Math.floor(getNewMoons(date)) > Math.floor(getNewMoons(new Date(date.getFullYear(), 0, 20))) ? 1 : 0
}

const getLunarNewYear = () => {
    const year = new Date().getFullYear();
    for (let i = 0; i <= 30; ++i) {
        let start = new Date(year, 0, 1)
        start.setDate(21 + i)
        if (inLunarNewYear(start)) return start.toDateString()
    }
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
        { type: 2, key: `${islamicDate(date, -1)}` },
        { type: 3, key: `${date.toDateString()}` } //note: if there are multiple type: 3 keys and their calculated dates are the same, it will only get the first one because of array.find below. leaving for now since there is only one and no more planned.
    ];

    //if today is the last occurence of this day in the month, check for those observances using -1 that was described in the observances multidimensional array above
    if (occurrence == totalOccurrence)
        keys.push({ type: 0, key: `${currentMonth},-1,${currentDayOfWeek}` });

    for (let i = 0; i < keys.length; ++i) {
        const values = observances.find(o => o.type == keys[i].type && o.key() === keys[i].key)?.values;
        if (values !== undefined) {
            for (let x = 0; x < values.length; ++x) {
                const observance = values[x];
                observancesToday.push({ name: observance.name, link: observance.link, emoji: observance.emojis() });
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
        emojis += observance[i].emoji;
    }
    return emojis;
}

module.exports = {
    observancesToday,
    observanceEmojisToday
};