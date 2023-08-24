const Discord = require(`discord.js`);
module.exports = {
    name: `poll`,
    description: `create a simple yes or no poll, or a complex poll with up to 11 custom choices`,
    aliases: [`p`], //other alias to use this command
    args: true, //arguments are required.
    usage: `*${process.env.COMMAND_PREFIX}p [yes or no question]* for a simple poll with a ✅ and ❌ choice, *${process.env.COMMAND_PREFIX}p [complex question], [choice 1], [choice 2], etc.* for a complex poll with multiple choices (🇦, 🇧, etc.). note that you can only have a maximum of 20 choices and must use a comma to separate your question and each choice.`, //how to use the command
    guildOnly: false, //usable inside servers only and not dms
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        let emojis = [];
        let choices = args.join(` `).split(`,`).map(x => x.trim());
        let question = choices.shift();
        let description = `### ${question}`;

        if (choices.length) {
            if (choices.length > 20) {
                return message.reply(`polls can only have a maximum of 20 choices separated by a comma.`);
            }
            let letters = [`🇦`, `🇧`, `🇨`, `🇩`, `🇪`, `🇫`, `🇬`, `🇭`, `🇮`, `🇯`, `🇰`, `🇱`, `🇲`, `🇳`, `🇴`, `🇵`, `🇶`, `🇷`, `🇸`, `🇹`];
            for (var i = 0; i < choices.length; ++i) {
                emojis.push(letters[i]);
                description += `\n ${emojis[i]} ${choices[i]}`;
            }
        } else { //this is a yes or no question
            emojis.push(`✅`, `❌`);
            description += `\n ✅ yes\n ❌ no`;
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`**${message.member.displayName}**`)
            .setThumbnail(`https://cdn.discordapp.com/attachments/696807093939994665/1144335737211342909/voting-box.png`)
            .setDescription(description);

        if (message.channel.type === `text`) { //if this isn't a dm, delete previous message
            message.delete({ timeout: 1 }).catch(e => { console.error(`poll command issue deleting previous message:`, e); });
        }

        return message.channel.send(embed)
            .then(r => {
                Promise.all(emojis.map((emoji) => {
                    r.react(emoji);
                }));
            })
            .catch(e => { console.error(`there was an error with the poll command`, e) });
    },
};