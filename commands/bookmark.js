const id = `60660d4a045a422b32377d59`;
const Jsonbin = require(`../modules/jsonbin`);

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
                    return message.channel.send(`that key is restricted, please try again with a different key`);
                } else {
                    Jsonbin.ReadBin(id)
                        .then(function (json) {
                            const record = json.record;
                            if (key in record) { //if key exists, ask if they want to replace value. If they do, update value.
                                record[key] = value;
                                return ReplaceKeyQuestion(record);
                            } else { //add the new key/value
                                record[key] = value;
                                return Update(record, `key has been added.`);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            return message.reply(`there was an error setting bookmark`);
                        });
                }
                break;
            }
            case `all`: {
                message.channel.send(`https://api.jsonbin.io/b/${id}/latest`);
                break;
            }
            default: //get
                Jsonbin.ReadBin(id)
                    .then(function (json) {
                        const record = json.record;
                        if (cmd in record) {
                            return message.channel.send(record[cmd]);
                        } else {
                            return message.reply(`that key does not exist.`)
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        return message.reply(`there was an error getting bookmark`);
                    });
                break;
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