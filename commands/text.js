module.exports = {
    name: `text`,
    description: `translate text into regional indicator emojis.`,
    aliases: [`t`], //other alias to use this command
    args: true, //arguments are required.
    usage: `*${process.env.PREFIX}t* [string to convert].`, //how to use the command
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        const numbers = [`zero`, `one`, `two`, `three`, `four`, `five`, `six`, `seven`, `eight`, `nine`];
        let data = ``; //empty string for a return message
        for (let i = 0; i < args.length; ++i) { //for each argument
            for (let c = 0; c < args[i].length; ++c) { //for each character in each argument
                const charCurrent = args[i].charAt(c);
                if (charCurrent.match(/[a-z]/i)) { //match alpha characters regardless of case
                    data += `:regional_indicator_${charCurrent.toLowerCase()}:`;
                }
                else if (charCurrent.match(/\d+/)) { //match numeric characters
                    data += `:${numbers[parseInt(charCurrent)]}:`;
                }
                else if (charCurrent == `?`) {
                    data += `:grey_question:`;
                }
                else if (charCurrent == `!`) {
                    data += `:grey_exclamation:`;
                }
                else {
                    data += charCurrent;
                }
                data += ` `; //added space in between each character to correctly display for mobile users
            }
            data += `  `; //added space inbetween each word
        }
        if (message.channel.type === `text`) { //if this isn't a dm, add the user's displayName and delete their original message.
            message.delete({ timeout: 1 }).catch(e => { console.error(`regional indicator command issue deleting previous message:`, e); });
            data = `${message.member.displayName} ${data}`;
        }
        message.channel.send(data)
            .catch(e => { console.error(`regional indicator command issue sending message:`, e); });
    },
};