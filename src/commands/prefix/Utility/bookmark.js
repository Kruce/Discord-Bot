const fetch = require('node-fetch');
const { Message, Collection } = require('discord.js');
const { log } = require('../../../functions/utility');
const ExtendedClient = require('../../../class/ExtendedClient');
const basicHeaders = {
    'Content-Type': 'application/json',
    'ApiKey': process.env.KRUCEBLAKE_API_KEY,
};

const GetBookmarksApi = async function () {
    const result = await fetch(`https://api.kruceblake.com/discordbot/getbookmarks`, {
        headers: basicHeaders,
    })
    if (!result.ok) throw new Error('kruce api error: ' + (await result.text()))
    return await result.json();
};

const PutBookmarksApi = async function (content) {
    const result = await fetch(`https://api.kruceblake.com/discordbot/putbookmarks`, {
        method: 'PUT',
        body: JSON.stringify(content),
        headers: basicHeaders,
    })
    if (!result.ok) throw new Error('kruce api error: ' + (await result.text()))
    return await result.json()
};

const PutBookmarks = async function (json, client) {
    if (!client.bookmarks) {
        client.bookmarks = new Collection();
    }
    await PutBookmarksApi(json);
    client.bookmarks.set("all", json);
};

const GetBookmarks = async function (client) {
    if (!client.bookmarks || !client.bookmarks.get("all")) {
        client.bookmarks = new Collection();
        let bookmarksApi = await GetBookmarksApi();
        client.bookmarks.set("all", bookmarksApi);
        return bookmarksApi;
    } else {
        return client.bookmarks.get("all");
    }
};

module.exports = {
    structure: {
        name: 'bookmark',
        description: `Get or set a bookmarked value or display all key/value pairs that are bookmarked.`,
        aliases: ['bm'],
        usage: `Enter arguments in the format of *set [bookmark key] [bookmark value]* to set a new bookmark or replace a bookmark with the same key argument. Enter a bookmark key argument to retrieve the bookmark. Enter an *all* argument to retrieve a link to all bookmarks.`,
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
                if (!key || !value) { //they want to set a bookmark but did not pass proper arguments
                    let reply = `the provided arguments are invald, ${message.author}.`;
                    if (this.usage) {
                        reply += `\n\`the proper usage would be:\` ${this.usage}`;
                    }
                    return await message.channel.send(reply);
                } else if ([`set`, `all`].indexOf(key.toLowerCase()) > -1) {
                    return await message.channel.send(`that key is restricted, please try again with a different key.`);
                } else {
                    let json = await GetBookmarks(message.client);
                    if (key in json) { //if key exists, ask if they want to replace value. If they do, update value.
                        await message.channel.send(`key already exists. would you like to update its value?`);
                        const filter = response => {
                            return response.author.id === message.author.id && [`y`, `yes`].some(r => r === response.content.toLowerCase());
                        };
                        const collected =
                            await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ['time'] })
                                .catch((e) => {
                                    log(`Bookmark had no 'y' or 'yes' response from user when prompted for update.`, "info");
                                });
                        if (collected) {
                            json[key] = value;
                            await PutBookmarks(json, message.client);
                            return await message.reply(`bookmark '${key}' has been updated.`);
                        }
                        return;
                    } else { //add the new key/value
                        json[key] = value;
                        await PutBookmarks(json, message.client);
                        return await message.reply(`bookmark '${key}' has been added.`);
                    }
                }
            }
            case `all`: {
                return await message.channel.send(`https://api.kruceblake.com/discordbot/getbookmarks`);
            }
            default:
                try {
                    let json = await GetBookmarks(message.client);
                    if (cmd in json) {
                        return await message.channel.send(json[cmd]);
                    } else {
                        return await message.reply(`that key does not exist.`)
                    }
                } catch (error) {
                    log(`Bookmark command error while attempting to get for: ${message.guild.name} id: ${message.guild.id}. \n ${error}`, "err");
                    return await message.reply(`there was an error getting that bookmark.`);
                };
        }
    },
};