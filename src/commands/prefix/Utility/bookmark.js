const { Message } = require('discord.js');
const { log } = require('../../../functions/utility');
const { fetch } = require('node-fetch');
const ExtendedClient = require('../../../class/ExtendedClient');
const BookmarkSchema = require('../../../schemas/BookmarkSchema');
const config = require('../../../config');

const upsertBookmark = async function (client, key, value) {
    await BookmarkSchema.findOneAndUpdate({ key: key }, { value: value }, { upsert: true });
    let cache = client.bookmarks.get(`cache`);
    cache.set(key, value);
}

const getBookmark = async function (client, key) {
    let bookmarks = client?.bookmarks?.get(`cache`);
    if (bookmarks)
        return bookmarks.get(key);
    else {
        log(`Bookmark issue finding ${key} in cache`, "warn");
        return await BookmarkSchema.findOne({ key: key }).lean()?.value;
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
        if (!config.handler?.mongodb?.enabled) {
            return await message.reply({ content: 'database is not ready, this command cannot be executed.' });
        };
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
                    const bookmark = await getBookmark(message.client, key);
                    if (bookmark) {
                        await message.channel.send(`key already exists. would you like to update its value?`);
                        const filter = response => {
                            return response.author == message.author && [`y`, `yes`].some(r => r === response.content.toLowerCase());
                        };
                        const collected = await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000, errors: ['time'] })
                            .catch((e) => {
                                return log(`Bookmark had no yes response from user when prompted for update.`, "info");
                            });
                        if (collected) {
                            await upsertBookmark(client, key, value);
                            return await message.reply(`bookmark has been updated.`);
                        }
                        return;
                    } else {
                        await upsertBookmark(client, key, value);
                        return await message.reply(`bookmark has been added.`);
                    }
                }
            }
            case `all`: {
                return await message.channel.send(`https://api.kruceblake.com/discordbot/getbookmarks`);
            }
            default:
                try {
                    const bookmark = await getBookmark(message.client, cmd);
                    if (bookmark)
                        return await message.channel.send(bookmark);
                    else
                        return await message.reply(`that key does not exist.`);
                } catch (error) {
                    log(`Bookmark command error while attempting to get for: ${message.guild.name} id: ${message.guild.id}. \n ${error}`, "err");
                    return await message.reply(`there was an error getting that bookmark.`);
                };
        }
    },
};