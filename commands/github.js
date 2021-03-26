module.exports = {
    name: `github`,
    description: `Link to this bot's github page.`,
    aliases: [`gh`], //other alias to use this command
    usage: `*${process.env.PREFIX}gh* or *${process.env.PREFIX}gh* rolename`, //how to use the command
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        if (args.length) {
            const command = message.client.commands.get(args[0]) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
            if (!command)
                return message.channel.send(`That command doesn't exists, here is this bot's github: https://github.com/Kruce/Discord-Bot.`)
            else
                return message.channel.send(`https://github.com/Kruce/Discord-Bot/blob/master/commands/${command.name}.js`)
        }
        else {
            return message.channel.send(`https://github.com/Kruce/Discord-Bot`)
        }
    },
};