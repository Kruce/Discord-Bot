const fs = require(`fs`);

module.exports = {
    name: `get`,
    description: `gets a value by keyword.`,
    usage: `*!get* [dictionary key].`, //how to use the command
    args: true, //arguments are required.
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        const saveFile = `./data/savecommands.txt`;
        const key = args[0].toUpperCase();
        if (!key) {
            let reply = `you didn't provide any arguments, ${message.author}.`;
            if (this.usage) {
                reply += `\nthe proper usage would be: \`${prefix}${this.name} ${this.usage}\``;
            }
            return message.channel.send(reply);
        }
        else {
            fs.readFile(saveFile, function (err, data) {
                if (err) return message.channel.send(`there was an error retrieving data.`);
                let file = fs.readFileSync(saveFile, `utf8`);
                let lineArray = file.split(/\r?\n/);
                let keyFound = false;
                lineArray.forEach((line, data) => {
                    if (line.includes(`${key} `)) { //if key was found, display the value
                        lineSplit = line.split(` `);
                        message.channel.send(lineSplit[lineSplit.length - 1]);
                        keyFound = true;
                    }
                });
                if (!keyFound) message.reply(`key not found`);
            });
        }
    },
};