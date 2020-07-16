const Discord = require(`discord.js`);
const Holiday = require(`../modules/holiday.js`);
module.exports = {
    name: `holiday`,
    description: `Description and information on today's holiday emoji.`,
    aliases: [`h`], //other alias to use this command
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        const holidays = Holiday.HolidaysToday();
        if (holidays && holidays.length) { //if any holidays exist, create a new embed message and add each holiday to its description
            let description = ``;
            for (var i = 0; i < holidays.length; ++i) {
                if (i > 0) description += `\n`; //add to a new line unless it is the first one
                description += `${holidays[i][0]} [${holidays[i][1]}](${holidays[i][2]})`;
            }
            const embed = new Discord.MessageEmbed()
                .setTitle(`Today's Holidays`)
                .setDescription(description)
                .setThumbnail(`https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png`)
                .setTimestamp(new Date().toUTCString());
            message.channel.send(embed)
                .catch(e => { console.error(`holiday command error sending message for: ${message.guild.name} id: ${message.guild.id}`, e); });
        }
    },
};