module.exports = {
    name: `help`,
    description: `list all of my commands or info about a specific command.`,
    aliases: [`commands`],
    usage: `[command name]`,
    cooldown: 5,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;
        if (!args.length) {
            data.push(`here's a list of all my commands:`);
            data.push(commands.map(command => command.name).join(`, `));
            data.push(`\nyou can send \`${process.env.PREFIX}help [command name]\` to get info on a specific command.`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === `dm`) return;
                    message.reply(`I've sent you a dm with all my commands.`);
                })
                .catch(error => {
                    console.error(`could not send help dm to ${message.author.tag}.\n`, error);
                    message.reply(`I can't dm you. Do you have dm's disabled?`);
                });
        }
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply(`that's not a valid command.`);
        }

        data.push(`**name:** ${command.name}`);

        if (command.aliases) data.push(`**aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**description:** ${command.description}`);
        if (command.usage) data.push(`**usage:** ${command.usage}`);

        data.push(`**cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });
    },
};