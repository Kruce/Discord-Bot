const GregorianHolidayByWeekAndDay = { // keys are formatted as "month,occurrence(or week),day of the week" using zero based. Use -1 for `last`, such as `the last monday of month`
    "0,3,1": `☮️`, //martin luther king jr. day
    "1,2,1": `🎩`, //president's day
    "2,1,0": `🌞`, //daylight saving's time begins
    "4,-1,1": `🎖️`, //memorial day
    "8,0,1": `🔨`, //labor day
    "10,0,0": `🌝`, //daylight savings time ends
    "10,4,4": `🦃` //thanksgiving
};

const GregorianHolidayByDate = { // keys are formatted as "month,day of the month" using zero based months
    "0,1": `🎉`, //new years day
    "1,1": `🙌🏿`, //black history month begins
    "1,14": `💘`, //valentine's day
    "2,17": `☘️`, //st. patrick's day
    "3,22": `🌎`, //earth day
    "3,24": `🇦🇲`, //armenian genocide remembrance day
    "4,5": `💃`, //cinco de mayo
    "4,15": `🇵🇸`, //nakba day
    "5,1": `🏳️‍🌈`, //pride month begins
    "5,19": `✊🏿`, //juneteenth
    "6,4": `🎆`, //independance day
    "9,31": `🎃`, //halloween
    "11,25": `🎄` //christmas
};

const IslamicHoliday = {
    "1 Ramadan": `🌙`, //ramadan
    "1 Shawwal": `😋`, //eid al-fitr
    "10 Dhul Hijja": `🐑` //eid al-adha 
};

/**
 * @param {number} startDate Day of the month to start at.
 * @param {number} dayOfWeek Day of the week that startDate falls on.
 * @param {number} endDate Day of the month to end at.
 * @param {number} dayOfWeekCount Day of the week to count between startDate and endDate.
 */
function GetOccurrenceOfWeekDay(startDate, dayOfWeek, endDate, dayOfWeekCount) {
    let total = 0;
    for (let currentDay = startDate; currentDay <= endDate; ++currentDay) {
        if (dayOfWeek == dayOfWeekCount) ++total;
        (dayOfWeek < 6) ? ++dayOfWeek : dayOfWeek = 0; //if day of the week is less than 6 (before Saturday) increment, otherwise set the next to 0 (Sunday) instead
    }
    return total;
}

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

module.exports = {
    /**
     * Check whether today's date is a holiday and return a string of emojis for each holiday. If no holiday, string will be empty.
     */
    getEmojis: function () {
        let date = new Date(); //create new date object
        let currentYear = date.getFullYear(); //extract current date info
        let currentMonth = date.getMonth();
        let currentDayOfWeek = date.getDay();
        let currentDayOfMonth = date.getDate();

        let firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); //get the week day of the first day of the month
        let lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); //get the last day of the month for the current month

        let occurrence = GetOccurrenceOfWeekDay(1, firstDayOfWeek, currentDayOfMonth, currentDayOfWeek); //get total occurrence of the current date's day from the 1st up to the current date for the month 
        let totalOccurrence = GetOccurrenceOfWeekDay(1, firstDayOfWeek, lastDayOfMonth, currentDayOfWeek); //get total occurrence of the current date's day from the 1st in the entire month 

        let holiday = []; //create new holiday array and add all holiday emojis if any
        holiday.push(GregorianHolidayByWeekAndDay[`${currentMonth},${occurrence},${currentDayOfWeek}`]); 
        holiday.push(GregorianHolidayByDate[`${currentMonth},${currentDayOfMonth}`]);
        holiday.push(IslamicHoliday[IslamicDate(currentYear, currentMonth, currentDayOfMonth)]);
        if (occurrence == totalOccurrence) holiday.push(GregorianHolidayByWeekAndDay[`${currentMonth},-1,${currentDayOfWeek}`]); //if today is the last occurrence of this weekday in the month, add any last occurrence holidays using -1 as the occurrence

        return holiday.join(``); //join into string removing any undefined values
    }
}