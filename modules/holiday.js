const GregorianHolidayByWeekAndDay = { // keys are formatted as "month,occurrence(or week),day of the week" using zero based. Use -1 for `last`, such as `the last monday of month`
    "0,3,1": [`☮️`, `Martin Luther King Jr. day`, `https://en.wikipedia.org/wiki/Martin_Luther_King_Jr._Day`],
    "1,2,1": [`🎩`, `President's day`, `https://en.wikipedia.org/wiki/Washington%27s_Birthday`],
    "2,1,0": [`🌞`, `Daylight savings time begins`, `https://en.wikipedia.org/wiki/Daylight_saving_time_in_the_United_States`],
    "4,-1,1": [`🎖️`, `Memorial day`, `https://en.wikipedia.org/wiki/Memorial_Day`],
    "8,0,1": [`🔨`, `Labor day`, `https://en.wikipedia.org/wiki/Labor_Day`],
    "10,0,0": [`🌝`, `Daylight savings time ends`, `https://en.wikipedia.org/wiki/Daylight_saving_time_in_the_United_States`],
    "10,4,4": [`🦃`, `Thanksgiving`, `https://en.wikipedia.org/wiki/Thanksgiving_(United_States)`]
};

const GregorianHolidayByDate = { // keys are formatted as "month,day of the month" using zero based months
    "0,1": [`🎉`, `New years day`, `https://en.wikipedia.org/wiki/New_Year%27s_Day`],
    "1,1": [`🙌🏿`, `Black history month begins`, `https://en.wikipedia.org/wiki/Black_History_Month`],
    "1,14": [`💘`, `Valentine's day`, `https://en.wikipedia.org/wiki/Valentine%27s_Day`],
    "2,17": [`☘️`, `St. Patrick's day`, `https://en.wikipedia.org/wiki/Saint_Patrick%27s_Day`],
    "2,30": [`🌱`, `Land day`, `https://en.wikipedia.org/wiki/Land_Day`],
    "3,22": [`🌎`, `Earth day`, `https://en.wikipedia.org/wiki/Earth_Day`],
    "3,24": [`🇦🇲`, `Armenian genocide rememberence day`, `https://en.wikipedia.org/wiki/Armenian_Genocide_Remembrance_Day`],
    "4,5": [`💃`, `Cinco de mayo`, `https://en.wikipedia.org/wiki/Cinco_de_Mayo`],
    "4,15": [`🇵🇸`, `Nakba day`, `https://en.wikipedia.org/wiki/Nakba_Day`],
    "5,1": [`🏳️‍🌈`, `Pride month begins`, `https://en.wikipedia.org/wiki/Gay_pride#LGBT_Pride_Month`],
    "5,19": [`✊🏿`, `Junteenth`, `https://en.wikipedia.org/wiki/Juneteenth`],
    "6,4": [`🎆`, `Independence day (United States)`, `https://en.wikipedia.org/wiki/Independence_Day_(United_States)`],
    "7,26": [`💪`, `Women's Equality Day`, `https://en.wikipedia.org/wiki/Women%27s_Equality_Day`],
    "9,31": [`🎃`, `Halloween`, `https://en.wikipedia.org/wiki/Halloween`],
    "11,25": [`🎄`, `Christmas`, `https://en.wikipedia.org/wiki/Christmas`],
    "11,26": [`🕯️`, `Kwanzaa`, `https://en.wikipedia.org/wiki/Kwanzaa`]
};

const IslamicHoliday = {
    "1 Muharram": [`☪️`, `Islamic new year`, `https://en.wikipedia.org/wiki/Islamic_New_Year`],
    "12 Rabi'ul Awwal": [`🎂`, `Mawlid`, `https://en.wikipedia.org/wiki/Mawlid`],
    "1 Ramadan": [`🌙`, `Ramadan begins`, `https://en.wikipedia.org/wiki/Ramadan`],
    "1 Shawwal": [`😋`, `Eid Al-Fitr`, `https://en.wikipedia.org/wiki/Eid_al-Fitr`],
    "10 Dhul Hijja": [`🐑`, `Eid Al-Adha`, `https://en.wikipedia.org/wiki/Eid_al-Adha`]
};

function KuwaitiCalendar(year, month, day, adjust) {
    var today = new Date();
    if (adjust) {
        adjustmili = 1000 * 60 * 60 * 24 * adjust;
        todaymili = today.getTime() + adjustmili;
        today = new Date(todaymili);
    }
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

    wd = (((jd + 1 % 7) + 7) % 7) + 1;

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

function IslamicDate(year, month, day, adjustment) {
    let monthNames = new Array(`Muharram`, `Safar`, `Rabi'ul Awwal`, `Rabi'ul Akhir`, `Jumadal Ula`, `Jumadal Akhira`, `Rajab`, `Sha'ban`, `Ramadan`, `Shawwal`, `Dhul Qa'ada`, `Dhul Hijja`);
    let date = KuwaitiCalendar(year, month, day, adjustment);
    return date[5] + " " + monthNames[date[6]];
}

/**
 * @param {number} startDate Day of the month to start at.
 * @param {number} dayOfWeek Day of the week that startDate falls on.
 * @param {number} endDate Day of the month to end at.
 * @param {number} dayOfWeekCount Day of the week to count between startDate and endDate.
 */
function OccurrenceOfWeekDay(startDate, dayOfWeek, endDate, dayOfWeekCount) {
    let total = 0;
    for (let currentDay = startDate; currentDay <= endDate; ++currentDay) {
        if (dayOfWeek == dayOfWeekCount) ++total;
        (dayOfWeek < 6) ? ++dayOfWeek : dayOfWeek = 0; //if day of the week is less than 6 (before Saturday) increment, otherwise set the next to 0 (Sunday) instead
    }
    return total;
}

/**
 * @param {Array} array The array with value to check
 * @param {object} key The key to check to get value
 * @param {Array} newArray The new array to push to if it exists in previous array
 */
function PushIfExists(array, key, newArray) {
    const value = array[key];
    if (value !== undefined) newArray.push(value);
}

/**
 * Check whether today's date is any holiday and return a holiday array indicating holidays as [`holiday emoji`, `holiday name`, `holiday link`].
 */
function HolidaysToday() {
    const date = new Date(new Date().toLocaleString(`en-US`, { timeZone: `America/New_York` })); //create new date object to local timezone
    const currentYear = date.getFullYear(); //extract current date info
    const currentMonth = date.getMonth();
    const currentDayOfWeek = date.getDay();
    const currentDayOfMonth = date.getDate();

    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); //get the week day of the first day of the month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); //get the last day of the month for the current month

    const occurrence = OccurrenceOfWeekDay(1, firstDayOfWeek, currentDayOfMonth, currentDayOfWeek); //get total occurrence of the current date's day from the 1st up to the current date for the month 
    const totalOccurrence = OccurrenceOfWeekDay(1, firstDayOfWeek, lastDayOfMonth, currentDayOfWeek); //get total occurrence of the current date's day from the 1st in the entire month 

    let holiday = []; //create new holiday array and add all holiday emojis if they exist in our predefined arrays
    PushIfExists(GregorianHolidayByWeekAndDay, `${currentMonth},${occurrence},${currentDayOfWeek}`, holiday);
    PushIfExists(GregorianHolidayByDate, `${currentMonth},${currentDayOfMonth}`, holiday);
    PushIfExists(IslamicHoliday, IslamicDate(currentYear, currentMonth, currentDayOfMonth), holiday);
    if (occurrence == totalOccurrence) //if today is the last occurrence of this weekday in the month, add any last occurrence holidays using -1
        PushIfExists(GregorianHolidayByWeekAndDay, `${currentMonth},-1,${currentDayOfWeek}`, holiday);
    return holiday;
}

/**
 * Check whether today's date is any holiday and return a string of all emojis indicating holidays if any.
 */
function EmojisToday() {
    const holiday = HolidaysToday();
    let emojis = ``;
    for (var i = 0; i < holiday.length; ++i) {
        emojis += holiday[i][0];
    }
    return emojis;
}

module.exports = {
    HolidaysToday,
    EmojisToday,
}