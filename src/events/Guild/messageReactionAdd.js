const config = require("../../config");
const { log } = require("../../functions");

module.exports = {
    event: "messageReactionAdd",
    /**
     *
     * @param {ExtendedClient} client
     * @param {Message<true>} message
     * @returns
     */
    run: async (client, reaction, user) => {
        if (user.bot) return;
        if (reaction.partial) { //check if the reaction is part of a partial, or previously uncached
            try { // If the message this reaction belongs to was removed fetching might result in an API error
                await reaction.fetch();
            } catch (error) {
                log(`Bub reaction command error when fetching the partial message for a reaction: \n ${error}`, "err");
                return;
            }
        } //message is cached and available now
        if (!config.handler.reactions) return;
        let react = client.collection.reactions.get(reaction.emoji.id);
        if (react) {
            try {
                react.run(client, reaction, user);
            } catch (error) {
                log(`Bub reaction command error running for: ${message.guild.name} id: ${message.guild.id}. \n ${error}`, "err");
            }
        }
    },
};