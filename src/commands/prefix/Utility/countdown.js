const fetch = require('node-fetch');
const { intlFormatDistance, parse, isValid } = require('date-fns');
const { enUS } = require('date-fns/locale');
const { Message, Collection } = require('discord.js');
const { log, dateTimeUsaTimezone } = require('../../../functions/utility');
const ExtendedClient = require('../../../class/ExtendedClient');
const basicHeaders = {
    'Content-Type': 'application/json',
    'X-KruceBlake-Api-Key': process.env.KRUCEBLAKE_API_KEY,
};

const GetCountdownsApi = async function () {
    const result = await fetch(`https://api.kruceblake.com/discordbot/getcountdowns`, {
        headers: basicHeaders,
    })
    if (!result.ok) throw new Error('kruce api error: ' + (await result.text()))
    return await result.json();
};

const PutCountdownsApi = async function (content) {
    const result = await fetch(`https://api.kruceblake.com/discordbot/putcountdowns`, {
        method: 'PUT',
        body: JSON.stringify(content),
        headers: basicHeaders,
    })
    if (!result.ok) throw new Error('kruce api error: ' + (await result.text()))
    return await result.json()
};

const PutCountdowns = async function (json, client) {
    if (!client.countdowns) {
        client.countdowns = new Collection();
    }
    await PutCountdownsApi(json);
    client.countdowns.set("all", json);
};

const GetCountdowns = async function (client) {
    if (!client.countdowns || !client.countdowns.get("all")) {
        client.countdowns = new Collection();
        let countdownsApi = await GetCountdownsApi();
        client.countdowns.set("all", countdownsApi);
        return countdownsApi;
    } else {
        return client.countdowns.get("all");
    }
};

module.exports = {
    structure: {
        name: 'countdown',
        description: `Get or set a countdown value.`,
        aliases: ['cd'],
        usage: `Enter arguments in the format of *set [countdown key] [countdown date (format: '05/29/1453' or '05/29/1453, 12:00 AM')]* to set a new countdown or replace a countdown with the same key argument. Enter a countdown key argument to retrieve the countdown.`,
        permissions: 'SendMessages',
        cooldown: 1
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const cmd = (args[0]) ? args[0].toLowerCase() : ``;
        switch (cmd) {
            case `set`: {
                const key = (args[1]) ? args[1].toLowerCase() : ``;
                const value = args.join(` `).slice(cmd.length + key.length + 2);
                if (!key || !value) { //they want to set a countdown but did not pass proper arguments
                    let reply = `the provided arguments are invald, ${message.author}.`;
                    if (this.usage) {
                        reply += `\n\`the proper usage would be:\` ${this.usage}`;
                    }
                    return await message.channel.send(reply);
                } else if ([`set`].indexOf(key.toLowerCase()) > -1) {
                    return await message.channel.send(`that key is restricted, please try again with a different key.`);
                } else {
                    const parsedPpDate = parse(value, 'Pp', new Date(), { locale: enUS });
                    const parsedPDate = parse(value, 'P', new Date(), { locale: enUS });
                    if (!isValid(parsedPpDate) && !isValid(parsedPDate))
                        return await message.channel.send(`Please enter a valid date/time in the format of '05/29/1453' or '05/29/1453, 12:00 AM' if a specific time is required.`);
                    let json = await GetCountdowns(message.client);
                    if (key in json) { //if key exists, ask if they want to replace value. If they do, update value.
                        await message.channel.send(`key already exists. would you like to update its value?`);
                        const filter = response => {
                            return response.author.id === message.author.id && [`y`, `yes`].some(r => r === response.content.toLowerCase());
                        };
                        const collected =
                            await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ['time'] })
                                .catch((e) => {
                                    log(`Countdown had no 'y' or 'yes' response from user when prompted for update.`, "info");
                                });
                        if (collected) {
                            json[key] = value;
                            await PutCountdowns(json, message.client);
                            return await message.reply(`countdown '${key}' has been updated.`);
                        }
                        return;
                    } else { //add the new key/value
                        json[key] = value;
                        await PutCountdowns(json, message.client);
                        return await message.reply(`countdown '${key}' has been added.`);
                    }
                }
            }
            default:
                try {
                    let json = await GetCountdowns(message.client);
                    if (cmd in json) {
                        const parsedDate = new Date(json[cmd]);
                        const todayDate = dateTimeUsaTimezone(process.env.TIMEZONE); //update hours to est from server time
                        const formattedDate = json[cmd];
                        if (formattedDate.indexOf(`,`) == -1) { //date only, no time
                            parsedDate.setHours(todayDate.getHours(), todayDate.getMinutes(), todayDate.getSeconds());
                        }
                        let distance = intlFormatDistance(parsedDate, todayDate);
                        const inDays = distance.includes(`day`) ? `` : ` (${intlFormatDistance(parsedDate, todayDate, { unit: 'day', numeric: 'always' })})`; //if distance is only days away, don't display days twice
                        if (![`days`, `hours`, `minutes`, `seconds`].some(x => distance.includes(x))) { //if distance is not days, hours, minutes, seconds 
                            if (distance.includes(` ago`)) { //add `about`
                                distance = `around ${distance}`;
                            }
                            else if (distance.includes(`in `)) {
                                distance = distance.replace(`in `, `in around `);
                            }
                        }
                        if (!distance.includes(`now`) && parsedDate < todayDate) {
                            return await message.channel.send(`${formattedDate} was ${distance}${inDays}`);
                        }
                        return await message.channel.send(`${formattedDate} is ${distance}${inDays}`);
                    } else {
                        return await message.reply(`that key does not exist.`)
                    }
                } catch (error) {
                    log(`Countdown command error while attempting to get for: ${message.guild.name} id: ${message.guild.id}. \n ${error}`, "err");
                    return await message.reply(`there was an error getting that countdown.`);
                };
        }
    },
};
