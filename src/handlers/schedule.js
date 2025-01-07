const schedule = require('node-schedule-tz');
const config = require("../config");
const overwatch = require("../handlers/overwatch");
const rivals = require("../handlers/rivals");
const { log } = require('../functions/utility');
const { observanceEmojisToday } = require('../functions/observance');
const ExtendedClient = require('../class/ExtendedClient');

/**
 * 
 * @param {ExtendedClient} client 
 */
module.exports = async (client) => {
    schedule.scheduleJob(`daily job`, `0 0 * * *`, `America/New_York`, async () => { //format is minute (0 - 59), hour (0 - 23), day of month (1 - 31), month (1 - 12), day of week (0 - 7)
        log(`Daily job has started ..`, "info");
        try {
            const emojis = observanceEmojisToday();
            let name = process.env.GUILD_NAME || config.guild.name;
            if (emojis != ``)
                name = `${emojis} ${name} ${emojis}`;
            client.guilds.cache.get(process.env.GUILD_ID).setName(name);
            
        } catch (error) {
            log(`Schedule job error updating guild name.\n${error}`, "err")
        }
        await overwatch(client);
        await rivals(client);
        log(`.. Daily job has finished!`, "info");
    });
};