const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('bookmarks')
        .setDescription('Find a specific bookmark.')
        .addStringOption(option =>
            option.setName('key')
                .setDescription('Select the key.')
                .setAutocomplete(true)
                .setRequired(true)),
    options: {
        cooldown: 5000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply();
        const data = interaction.options.data !== undefined && interaction.options.data.length != 0 ? interaction.options.data : null;
        if (data) {
            if (data.length > 1)
                return await interaction.followUp(`Select a bookmark.`);
            let bookmarks = client?.bookmarks?.get(`cache`);
            let bookmark = bookmarks.get(data[0].value);
            if (!bookmark)
                return await interaction.followUp(`That bookmark does not exist.`);
            else
                return await interaction.followUp(bookmark);
        } else {
            return await interaction.followUp(`Select a bookmark.`);
        }
    }
};