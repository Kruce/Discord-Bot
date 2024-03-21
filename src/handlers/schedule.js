const schedule = require('node-schedule-tz');
const config = require("../config");
const overwatch = require("../handlers/overwatch");
const { log, observanceEmojisToday } = require('../functions');
const ExtendedClient = require('../class/ExtendedClient');

/**
 * 
 * @param {ExtendedClient} client 
 */
module.exports = async (client) => {
    schedule.scheduleJob(`daily job`, `0 0 * * *`, `America/New_York`, async () => { //format is minute (0 - 59), hour (0 - 23), day of month (1 - 31), month (1 - 12), day of week (0 - 7)
        try {
            log(`Daily job has started ..`, "info");
            const emojis = observanceEmojisToday();
            let name = process.env.GUILD_NAME || config.guild.name;
            if (emojis != ``)
                name = `${emojis} ${name} ${emojis}`;
            client.guilds.cache.get(process.env.GUILD_ID).setName(name);
            await overwatch(client);
            log(`.. Daily job has finished!`, "info");
        } catch (error) {
            log(`.. Daily job has finished with errors.\n${error}`, "err")
        }
    });
};