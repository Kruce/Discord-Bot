const Discord = require(`discord.js`);
const Fetch = require(`node-fetch`);
const basicHeaders = {
    'Content-Type': 'application/json',
    'ApiKey': process.env.KRUCEBLAKE_API_KEY,
};

const GetBookmarksApi = async function () {
    const result = await Fetch(`https://api.kruceblake.com/discordbot/getbookmarks`, {
        headers: basicHeaders,
    })
    if (!result.ok) throw new Error('kruce api error: ' + (await result.text()))
    return await result.json();
};

const PutBookmarksApi = async function (content) {
    const result = await Fetch(`https://api.kruceblake.com/discordbot/putbookmarks`, {
        method: 'PUT',
        body: JSON.stringify(content),
        headers: basicHeaders,
    })
    if (!result.ok) throw new Error('kruce api error: ' + (await result.text()))
    return await result.json()
};

module.exports = {
    name: `bookmark`,
    description: `get or set a value or display all key/value pairs that are bookmarked`,
    aliases: [`bm`], //other alias to use this command
    usage: `*${process.env.COMMAND_PREFIX}bm* [bookmark key], *${process.env.COMMAND_PREFIX}bm set* [bookmark key] [bookmark value], *${process.env.COMMAND_PREFIX}bm all*`, //how to use the command
    args: true, //arguments are required.
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
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
                    return message.channel.send(reply);
                } else if ([`set`, `all`].indexOf(key.toLowerCase()) > -1) {
                    return message.channel.send(`that key is restricted, please try again with a different key.`);
                } else {
                    GetBookmarks()
                        .then(function (json) {
                            if (key in json) { //if key exists, ask if they want to replace value. If they do, update value.
                                json[key] = value;
                                return ReplaceKeyQuestion(json);
                            } else { //add the new key/value
                                json[key] = value;
                                return AddBookmark(json);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            return message.reply(`there was an error setting that bookmark.`);
                        });
                }
                break;
            }
            case `all`: {
                message.channel.send(`https://api.kruceblake.com/discordbot/getbookmarks`);
                break;
            }
            default:
                GetBookmarks()
                    .then(function (json) {
                        if (cmd in json) {
                            return message.channel.send(json[cmd]);
                        } else {
                            return message.reply(`that key does not exist.`)
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        return message.reply(`there was an error getting bookmark.`);
                    });
                break;
        }

        const ReplaceKeyQuestion = (content) => {
            message.channel.send(`key already exists. would you like to update its value?`)
                .then(() => {
                    const filter = response => {
                        return response.author == message.author && [`y`, `yes`].some(r => r === response.content.toLowerCase());
                    };
                    message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                        .then(() => {
                            return PutBookmarks(content);
                        })
                        .then(() => {
                            return message.reply(`bookmark has been updated.`);
                        });
                });
        };

        const AddBookmark = (content) => {
            PutBookmarks(content)
                .then(() => {
                    return message.reply(`bookmark has been added.`);
                });
        };

        async function GetBookmarks() {
            if (!message.client.bookmarks || !message.client.bookmarks.get("all")) {
                message.client.bookmarks = new Discord.Collection();
                let bookmarksApi = await GetBookmarksApi();
                message.client.bookmarks.set("all", bookmarksApi);
                return bookmarksApi;
            } else {
                return message.client.bookmarks.get("all");
            }
        };

        async function PutBookmarks(json) {
            if (!message.client.bookmarks) {
                message.client.bookmarks = new Discord.Collection();
            }
            await PutBookmarksApi(json);
            message.client.bookmarks.set("all", json);
        };
    },
};