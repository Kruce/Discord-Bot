const { Message, ChannelType, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: {
        name: 'poll',
        description: 'Create a simple yes or no poll, or a complex poll with up to 20 custom choices',
        aliases: ['p'],
        usage: `Enter a yes or no question argument for a simple poll with a ✅ and ❌ choice. Enter arguments in the format of *[complex question], [choice 1], [choice 2], etc.* for a complex poll with multiple choices (🇦, 🇧, etc.). Note that you can only have a maximum of 20 choices and must use a comma to separate your question and each choice argument.`,
        permissions: "SendMessages",
        cooldown: 1
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
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

        const embed = new EmbedBuilder()
            .setTitle(`**${message.member.displayName}**`)
            .setThumbnail(`https://cdn.discordapp.com/attachments/696807093939994665/1144335737211342909/voting-box.png`)
            .setColor("ff0000")
            .setDescription(description);

        if (message.channel.type === ChannelType.GuildText) { //if this isn't a dm, delete previous message
            message.delete({ timeout: 1 }).catch(e => { console.error(`poll command issue deleting previous message:`, e); });
        }

        return await message.channel.send({ embeds: [embed] })
            .then(r => {
                Promise.all(emojis.map((emoji) => {
                    r.react(emoji);
                }));
            })
            .catch(error => { console.error(`there was an error with the poll command`, error) });
    },
};