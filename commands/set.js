const fs = require(`fs`);

module.exports = {
    name: `set`,
    description: `sets a keyword and value to retrieve using get command.`,
    usage: `*${process.env.PREFIX}set* [dictionary key] [word or value].`, //how to use the command
    args: true, //arguments are required.
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        const saveFile = `./data/savecommands.txt`;
        const key = args[0].toUpperCase();
        const value = args[1];
        if (!key && !value) {
            let reply = `You didn't provide any arguments, ${message.author}.`;
            if (this.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${this.name} ${this.usage}\``;
            }
            return message.channel.send(reply);
        }
        else {
            fs.readFile(saveFile, function (err, data) {
                if (err) return message.channel.send(`There was an error saving data.`);
                if (data.includes(key)) { //does this key already exist? if so display error 
                    message.reply(`that key already exists`);
                }
                else { //key was not found, save key and value
                    message.reply(`key and value saved`);
                    fs.appendFileSync(saveFile, `\r\n${key} ${value}`); //add to flat file
                }
            });
        }
    },
};