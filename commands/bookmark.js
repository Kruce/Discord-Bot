const id = `60660d4a045a422b32377d59`;
const Jsonbin = require(`../modules/jsonbin`);

module.exports = {
    name: `bookmark`,
    description: `get or set a value or display all key/value pairs that are bookmarked`,
    aliases: [`bm`], //other alias to use this command
    usage: `*${process.env.COMMAND_PREFIX}bm get* [bookmark key], *${process.env.COMMAND_PREFIX}bm set* [bookmark key] [bookmark value], *${process.env.COMMAND_PREFIX}bm all*`, //how to use the command
    args: true, //arguments are required.
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        const cmd = args[0];
        if (['set', 'get', 'all'].indexOf(cmd) < 0) { //they passed a command but it is not set or get
            let reply = `the provided arguments are invald, ${message.author}.`;
            if (this.usage) {
                reply += `\n\`the proper usage would be:\` ${this.usage}`;
            }
            return message.channel.send(reply);
        }
        else {
            switch (cmd) {
                case `set`: {
                    if (!args[1] || !args[2]) { //if missing key and/or value
                        let msg = `you must provide `;
                        if (!args[1] && !args[2]) {
                            msg += `a key and a value`;
                        } else if (!args[1]) {
                            msg += `a key`;
                        }
                        else {
                            msg += `a value`;
                        }
                        return message.reply(msg);
                    }
                    const key = args[1].toLowerCase();
                    const value = args.join(` `).slice(cmd.length + key.length + 2); //remove cmd and key and join for value
                    Jsonbin.ReadBin(id)
                        .then(function (json) {
                            const record = json.record;
                            if (key in record) { //if key exists, ask if they want to replace value. If they do, update value.
                                record[key] = value;
                                return ReplaceKeyQuestion(record);
                            }
                            else { //add the new key/value
                                record[key] = value;
                                return Update(record, `key has been added.`);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            return message.reply(`there was an error setting bookmark`);
                        });
                    break;
                }
                case `get`: {
                    if (!args[1]) { //if missing key value
                        return message.reply(`you must provide a key`);
                    }
                    const key = args[1].toLowerCase();
                    Jsonbin.ReadBin(id)
                        .then(function (json) {
                            const record = json.record;
                            if (key in record) {
                                return message.channel.send(record[key]);
                            }
                            else {
                                return message.reply(`that key does not exist.`)
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            return message.reply(`there was an error getting bookmark`);
                        });
                    break;
                }
                case `all`: {
                    message.channel.send(`https://api.jsonbin.io/b/${id}/latest`);
                    break;
                }
                default:
                    return;
            }
        }
        const ReplaceKeyQuestion = (content) =>
            message.channel.send(`key already exists. would you like to update its value?`)
                .then(() => {
                    const filter = response => {
                        return [`y`, `yes`].some(r => r === response.content.toLowerCase());
                    };
                    message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                        .then(collected => {
                            Update(content, `key has been updated.`);
                        })
                        .catch(collected => {
                            return ``;
                        });
                });
        const Update = (content, msg) => {
            Jsonbin.UpdateBin(id, content);
            return message.reply(msg);
        }
    },
};