module.exports = {
    name: `regionalindicator`,
    description: `Translate text into regional indicator emojis.`,
    aliases: [`r`], //other alias to use this command
    args: true, //arguments are required.
    usage: `<words>`, //how to use the command
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        const numbers = [`zero`, `one`, `two`, `three`, `four`, `five`, `six`, `seven`, `eight`, `nine`];
        let msg = ``; //empty string for a return message
        for (let i = 0; i < args.length; ++i) { //for each argument
            for (let c = 0; c < args[i].length; ++c) { //for each character in each argument
                let charCurrent = args[i].charAt(c);
                if (charCurrent.match(/[a-z]/i)) { //match alpha characters regardless of case
                    msg += `:regional_indicator_${charCurrent.toLowerCase()}:`;
                }
                else if (charCurrent.match(/\d+/)) { //match numeric characters
                    msg += `:${numbers[parseInt(charCurrent)]}:`;
                }
                else if (charCurrent == `?`) {
                    msg += `:grey_question:`;
                }
                else if (charCurrent == `!`) {
                    msg += `:grey_exclamation:`;
                }
                else {
                    msg += charCurrent;
                }
                msg += ` `; //added space in between each character to correctly display for mobile users
            }
            msg += `  ` //added space inbetween each word
        }
        message.delete({ timeout: 1 }).catch(e => {
            console.log(`error deleting message for: ${message.guild.name} for id: ${message.guild.id}`);
        });
        message.channel.send(`${message.member.displayName} ${msg}`).catch(e => {
            console.log(`error sending message for: ${message.guild.name} id: ${message.guild.id}`);
        });
    },
};