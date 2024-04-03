const { Message } = require('discord.js');
const { log, shuffleArray } = require('../../functions/utility');
const ExtendedClient = require('../../class/ExtendedClient');

module.exports = {
    structure: {
        name: 'bub',
        emojiId: '651815701782200320', 
        description: 'Automatically reacts to a message with all guild pet emojis when this emoji is reacted. include your pet emoji by uploading one and ending the name with an underscore',
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, reaction, user) => {
        const message = reaction.message;
        let petEmojis = shuffleArray(message.guild.emojis.cache.filter(emoji => emoji.name.endsWith(`_`)).map(emoji => emoji.id));
        let totalReactionAmount = 20 - message.reactions.cache.size; //20 is the max amount of emojis allowed, subtract any slots already used
        //if message already has pet emojis, move to the front or back based on whether the bot reacted to them already or not
        message.reactions.cache.forEach((reaction) => {
            if (reaction.emoji.name.endsWith(`_`)) {
                let index = petEmojis.indexOf(reaction.emoji.id);
                if (index !== -1) {
                    let pet = petEmojis.splice(index, 1)[0];
                    if (reaction.me) {
                        petEmojis.push(pet);
                    }
                    else {
                        petEmojis.unshift(pet);
                        totalReactionAmount += 1; //add one reaction if it was a pet that hasn't been reacted by the bot yet
                    }
                }
            }
        });
        if (totalReactionAmount == 0)
            return;
        Promise.all(petEmojis.slice(0, totalReactionAmount).map(reaction => message.react(reaction)))
            .catch(error => {
                log(`adding pet emojis from bub react error in: ${message.guild.name} id: ${message.guild.id}. \n ${error}`, "err");
            });
    }
};