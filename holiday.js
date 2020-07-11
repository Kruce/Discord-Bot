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

function GetWeekdayCountBetweenDates(startDay, endDay, dayOfWeek) {
    let total = 0;
    let start = new Date(startDay);
    for (let date = start; date <= endDay; date.setDate(date.getDate() + 1)) {
        if (date.getDay() == dayOfWeek) total++;
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
    getHoliday: function () {
        let date = new Date(); //create new date object
        let year = date.getFullYear(); //extract current date info
        let month = date.getMonth();
        let dayOfWeek = date.getDay();
        let dayOfMonth = date.getDate();

        let currentDay = new Date(year, month, dayOfMonth); //create new date object without time
        let firstDay = new Date(year, month, 1);
        let lastDay = new Date(year, month + 1, 0);

        let occurrence = GetWeekdayCountBetweenDates(firstDay, currentDay, dayOfWeek); //get total occurrence of the current date's day up to the current date for the month 
        let totalOccurence = GetWeekdayCountBetweenDates(firstDay, lastDay, dayOfWeek); //get total occurrence of the current date's day in the entire month 

        let holiday = [ //join each array results if any into one holiday
            GregorianHolidayByWeekAndDay[`${month},${occurrence},${dayOfWeek}`],
            GregorianHolidayByDate[`${month},${dayOfMonth}`],
            IslamicHoliday[IslamicDate(year, month, dayOfMonth)]
        ];
        if (occurrence === totalOccurence) { //if this is the last occurence, add any last occurences using -1 as occurrence/week
            holiday.push(GregorianHolidayByWeekAndDay[`${month},-1,${dayOfWeek}`])
        }
        return holiday.join(``);
    }
}