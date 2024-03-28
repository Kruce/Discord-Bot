const { AutocompleteInteraction } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');

module.exports = {
    commandName: 'help',
    options: {
        public: true
    },
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {AutocompleteInteraction} interaction 
     */
    run: async (client, interaction) => {
        let commands = [];
        const currentInput = interaction.options.getFocused(true);
        switch (currentInput.name) {
            case 'slash':
                commands = client.applicationcommandsArray.map((v) => v.name);
                break;
            case 'prefix':
                commands = client.collection.prefixcommands.map((v) => v.structure.name);
                break;
            case 'reaction':
                commands = client.collection.reactions.map((v) => v.structure.name);
                break;
        }

        let filteredCommands = commands.filter((c) => c.toLowerCase().startsWith(currentInput.value.toLowerCase()));
        await interaction.respond(filteredCommands.map(cmd => ({ name: cmd, value: cmd })));
    }
};