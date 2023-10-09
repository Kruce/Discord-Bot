const holidays = [ //multidimensional array where the first array is for gregorian holidays by week and day, the second array is for gregorian holidays by date, and the third is for islamic holidays
    { //keys are formatted as "month (using zero based), occurrence (or week), day of the week". Use -1 for `last`, such as `the last monday of month` in the occurrence and zero starts sunday for day of week
        "0,3,1":
            [
                [`☮️`, `Martin Luther King Jr. day`, `https://en.wikipedia.org/wiki/Martin_Luther_King_Jr._Day`]
            ],
        "1,3,1":
            [
                [`🎩`, `President's day`, `https://en.wikipedia.org/wiki/Washington%27s_Birthday`]
            ],
        "2,2,0":
            [
                [`🌞`, `Daylight savings time begins`, `https://en.wikipedia.org/wiki/Daylight_saving_time_in_the_United_States`]
            ],
        "4,-1,1":
            [
                [`🎖️`, `Memorial day`, `https://en.wikipedia.org/wiki/Memorial_Day`]
            ],
        "8,1,1":
            [
                [`🔨`, `Labor day`, `https://en.wikipedia.org/wiki/Labor_Day`]
            ],
        "9,2,1":
            [
                [`🍁`, `Thanksgiving (Canada)`, `https://en.wikipedia.org/wiki/Thanksgiving_(Canada)`],
                [`🌄`, `Indigenous Peoples' Day`, `https://en.wikipedia.org/wiki/Indigenous_Peoples'_Day`]
            ],
        "10,1,0":
            [
                [`🌝`, `Daylight savings time ends`, `https://en.wikipedia.org/wiki/Daylight_saving_time_in_the_United_States`]
            ],
        "10,4,4":
            [
                [`🦃`, `Thanksgiving`, `https://en.wikipedia.org/wiki/Thanksgiving_(United_States)`]
            ]
    },
    { //keys are formatted as "month (using zero based), day of the month" 
        "0,1":
            [
                [`🎉`, `New years day`, `https://en.wikipedia.org/wiki/New_Year%27s_Day`]
            ],
        "1,1":
            [
                [`🙌🏿`, `Black history month begins`, `https://en.wikipedia.org/wiki/Black_History_Month`]
            ],
        "1,2":
            [
                [`🐿️`, `Groundhog day`, `https://en.wikipedia.org/wiki/Groundhog_Day`]
            ],
        "1,14":
            [
                [`💘`, `Valentine's day`, `https://en.wikipedia.org/wiki/Valentine%27s_Day`]
            ],
        "2,17":
            [
                [`☘️`, `St. Patrick's day`, `https://en.wikipedia.org/wiki/Saint_Patrick%27s_Day`]
            ],
        "2,30":
            [
                [`🌱`, `Land day`, `https://en.wikipedia.org/wiki/Land_Day`]
            ],
        "3,13":
            [
                [CambodianNewYearEmoji(), `Cambodian new year begins`, `https://en.wikipedia.org/wiki/Cambodian_New_Year`]
            ],
        "3,22":
            [
                [`🌎`, `Earth day`, `https://en.wikipedia.org/wiki/Earth_Day`]
            ],
        "3,24":
            [
                [`🇦🇲`, `Armenian genocide rememberence day`, `https://en.wikipedia.org/wiki/Armenian_Genocide_Remembrance_Day`]
            ],
        "4,5":
            [
                [`💃`, `Cinco de mayo`, `https://en.wikipedia.org/wiki/Cinco_de_Mayo`]
            ],
        "4,15":
            [
                [`🇵🇸`, `Nakba day`, `https://en.wikipedia.org/wiki/Nakba_Day`]
            ],
        "5,1":
            [
                [`🏳️‍🌈`, `Pride month begins`, `https://en.wikipedia.org/wiki/Gay_pride#LGBT_Pride_Month`]
            ],
        "5,19":
            [
                [`✊🏿`, `Juneteenth`, `https://en.wikipedia.org/wiki/Juneteenth`]
            ],
        "6,1":
            [
                [`🇨🇦`, `Canada day`, `https://en.wikipedia.org/wiki/Canada_Day`]
            ],
        "6,4":
            [
                [`🎆`, `Independence day (United States)`, `https://en.wikipedia.org/wiki/Independence_Day_(United_States)`]
            ],
        "7,26":
            [
                [`💪`, `Women's equality day`, `https://en.wikipedia.org/wiki/Women%27s_Equality_Day`]
            ],
        "9,11":
            [
                [`🌄`, `Indigenous Peoples' Day`, `https://en.wikipedia.org/wiki/Indigenous_Peoples'_Day`]
            ],
        "9,31":
            [
                [`🎃`, `Halloween`, `https://en.wikipedia.org/wiki/Halloween`]
            ],
        "11,25":
            [
                [`🎄`, `Christmas`, `https://en.wikipedia.org/wiki/Christmas`]
            ],
        "11,26":
            [
                [`🕯️`, `Kwanzaa begins`, `https://en.wikipedia.org/wiki/Kwanzaa`]
            ]
    },
    {
        "1 Muharram": 
            [
                [`☪️`, `Islamic new year`, `https://en.wikipedia.org/wiki/Islamic_New_Year`]
            ],
        "12 Rabi'ul Awwal": 
            [
                [`🎂`, `Mawlid`, `https://en.wikipedia.org/wiki/Mawlid`]
            ],
        "1 Ramadan": 
            [
                [`🌙`, `Ramadan begins`, `https://en.wikipedia.org/wiki/Ramadan`]
            ],
        "1 Shawwal": 
            [
                [`😋`, `Eid Al-Fitr`, `https://en.wikipedia.org/wiki/Eid_al-Fitr`]
            ],
        "10 Dhul Hijja": 
            [
                [`🐑`, `Eid Al-Adha begins`, `https://en.wikipedia.org/wiki/Eid_al-Adha`]
            ]
    }
];

function CambodianNewYearEmoji() {
    const year = new Date().getFullYear();
    const key = ((year - 4) % 12);
    const emojis = [`🐀`, `🐂`, `🐅`, `🐇`, `🐉`, `🐍`, `🐎`, `🐐`, `🐒`, `🐓`, `🐕`, `🐖`];
    return emojis[key];
}

function gmod(n, m) {
    return ((n % m) + m) % m;
}

function KuwaitiCalendar(date, adjust) {
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

function IslamicDate(date, adjustment) {
    let monthNames = new Array(`Muharram`, `Safar`, `Rabi'ul Awwal`, `Rabi'ul Akhir`, `Jumadal Ula`, `Jumadal Akhira`, `Rajab`, `Sha'ban`, `Ramadan`, `Shawwal`, `Dhul Qa'ada`, `Dhul Hijja`);
    let iDate = KuwaitiCalendar(date, adjustment);
    return iDate[5] + " " + monthNames[iDate[6]];
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
 * Check whether today's date is any holiday and return a holiday array indicating holidays as [`holiday emoji`, `holiday name`, `holiday link`].
 */
function HolidaysToday() {
    const date = new Date();
    date.setHours(date.getHours() - 4); //update hours to est for coordinated universal time
    console.log(`holiday command date: ` + date);
    const currentYear = date.getFullYear(); //extract current date info
    const currentMonth = date.getMonth();
    const currentDayOfWeek = date.getDay();
    const currentDayOfMonth = date.getDate();

    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); //get the week day of the first day of the month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); //get the last day of the month for the current month

    const occurrence = OccurrenceOfWeekDay(1, firstDayOfWeek, currentDayOfMonth, currentDayOfWeek); //get total occurrence of the current date's day from the 1st up to the current date for the month 
    const totalOccurrence = OccurrenceOfWeekDay(1, firstDayOfWeek, lastDayOfMonth, currentDayOfWeek); //get total occurrence of the current date's day from the 1st in the entire month 

    let holiday = []; //create new holiday array and add all holiday emojis if they exist in our predefined arrays
    let keys = [ //each array within this multidimensional array has two values. The first value is the key that is used to get the applicable holidays sub-array in the 'holidays' multidimensional array, and the second is today's generated key to check if any holidays match within that sub-array
        [0, `${currentMonth},${occurrence},${currentDayOfWeek}`],
        [1, `${currentMonth},${currentDayOfMonth}`],
        [2, `${IslamicDate(date, -1)}`],
    ];

    //if today is the last occurence of this day in the month, check for those holidays using -1 that was described in the holidays multidimensional array above
    if (occurrence == totalOccurrence) keys.push([0, `${currentMonth},-1,${currentDayOfWeek}`]);

    for (let i = 0; i < keys.length; ++i) { //for each of our keys, check their applicable holiday array to see if any holidays exist
        const array = holidays[keys[i][0]];
        const key = keys[i][1];
        const values = array[key];
        if (values !== undefined) {
            for (let x = 0; x < values.length; ++x) {
                holiday.push(values[x])
            }
        }
    }

    return holiday;
}

/**
 * Check whether today's date is any holiday and return a string of all emojis indicating holidays if any.
 */
function EmojisToday() {
    const holiday = HolidaysToday();
    let emojis = ``;
    for (let i = 0; i < holiday.length; ++i) {
        emojis += holiday[i][0];
    }
    return emojis;
}

module.exports = {
    HolidaysToday,
    EmojisToday,
}
