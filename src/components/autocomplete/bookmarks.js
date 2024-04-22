const { AutocompleteInteraction } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const BookmarkSchema = require('../../schemas/BookmarkSchema');

module.exports = {
    commandName: 'bookmarks',
    options: {
        public: true
    },
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {AutocompleteInteraction} interaction 
     */
    run: async (client, interaction) => {
        const currentInput = interaction.options.getFocused(true);
        // let bookmarks = client?.bookmarks?.get(`cache`);
        // let filteredBookmarks = [...bookmarks.entries()]
        //     .filter((bookmark) => bookmark[0].startsWith())
        //     .slice(0, 25)
        //     .map(bookmark => ({ name: bookmark[0], value: bookmark[0] }));
        const regex = new RegExp(currentInput.value.toLowerCase(), "i");
        const results = await BookmarkSchema.find({ key: regex }, 'key').lean().limit(25).exec();
        const filteredBookmarks = results.map(bookmark => ({ name: bookmark.key, value: bookmark.key }));
        await interaction.respond(filteredBookmarks);
    }
};