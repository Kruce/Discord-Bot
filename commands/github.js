module.exports = {
    name: `github`,
    description: `link to this bot's github page.`,
    aliases: [`gh`], //other alias to use this command
    usage: `*${process.env.COMMAND_PREFIX}gh* or *${process.env.COMMAND_PREFIX}gh* [role name]`, //how to use the command
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        let data = ``; //empty string for a return message
        if (args.length) {
            const command = message.client.commands.get(args[0]) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
            if (!command)
                data = `that command does not exist. here is this bot's github: https://github.com/Kruce/Discord-Bot`;
            else
                data = `https://github.com/Kruce/Discord-Bot/blob/master/commands/${command.name}.js`;
        }
        else
            data = `https://github.com/Kruce/Discord-Bot`;
        return message.channel.send(data).catch(e => { console.error(`github command issue sending message:`, e); });
    },
};