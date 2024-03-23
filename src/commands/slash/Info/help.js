const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('help')
        .setDescription('View info on all commands or on one selected command.')
        .addStringOption(option =>
            option.setName('slash')
                .setDescription('Choose a slash type command.')
                .setAutocomplete(true)
                .setRequired(false))
        .addStringOption(option =>
            option.setName('prefix')
                .setDescription('Choose a prefix type command')
                .setAutocomplete(true)
                .setRequired(false))
        .addStringOption(option =>
            option.setName('reaction')
                .setDescription('Choose a reaction type command')
                .setAutocomplete(true)
                .setRequired(false)),
    options: {
        cooldown: 5000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply();
        let embeds = [];
        let prefix = process.env.PREFIX || config.handler.prefix;
        let data = interaction.options.data !== undefined && interaction.options.data.length != 0 ? interaction.options.data : null;
        if (data) {
            if (data.length > 1)
                return await interaction.followUp(`Select one command at a time or none to view all commands.`);
            let chosen = data[0];
            let command = null;
            switch (chosen.name) {
                case 'slash':
                    command = client.applicationcommandsArray.find((c) => c.name.startsWith(chosen.value));
                    if (!command)
                        return await interaction.followUp(`The slash command entered does not exist. Please select one from the given choices.`);
                    embeds.push(new EmbedBuilder()
                        .setTitle(`Slash command: \`${(command.type === 2 || command.type === 3) ? '' : '/'}${command.name}\``)
                        .setColor("e91e63")
                        .addFields(
                            { name: 'Description:', value: `${command.description || '(No description)'}` },
                            { name: 'Options:', value: `${command.options.map(o => o.name).join('\n') || '(No aliases)'}` }
                        ));
                    break;
                case 'prefix':
                    command = client.collection.prefixcommands.find((c) => c.structure.name.startsWith(chosen.value));
                    if (!command)
                        return await interaction.followUp(`The prefix command entered does not exist. Please select one from the given choices.`);
                    embeds.push(new EmbedBuilder()
                        .setTitle(`Prefix command: \`${prefix}${command.structure.name}\``)
                        .setColor("e91e63")
                        .addFields(
                            { name: 'Description:', value: `${command.structure.description || '(No description)'}` },
                            { name: 'Aliases:', value: `${command.structure.aliases.join('\n') || '(No aliases)'}` },
                            { name: 'Usage:', value: `${command.structure.usage || '(No usage)'}` },
                            { name: 'Cooldown:', value: `${command.structure.cooldown}` },
                        ));
                    break;
                case 'reaction':
                    command = client.collection.reactions.find((c) => c.structure.name.startsWith(chosen.value));
                    if (!command)
                        return await interaction.followUp(`The reaction command entered does not exist. Please select one from the given choices.`);
                    embeds.push(new EmbedBuilder()
                        .setTitle(`Reaction command: <:${command.structure.name}:${command.structure.emojiId}>`)
                        .setColor("e91e63")
                        .addFields(
                            { name: 'Description:', value: `${command.structure.description || '(No description)'}` }
                        ));
                    break;
            }
        } else { //get all commands
            const mapIntCmds = client.applicationcommandsArray.map((v) => `\`${(v.type === 2 || v.type === 3) ? '' : '/'}${v.name}\`: ${v.description || '(No description)'}`);
            const mapPreCmds = client.collection.prefixcommands.map((v) => `\`${prefix}${v.structure.name}\` (${v.structure.aliases.length > 0 ? v.structure.aliases.map((a) => `**${a}**`).join(', ') : 'None'}): ${v.structure.description || '(No description)'}`);
            const mapReactCmds = client.collection.reactions.map((v) => `<:${v.structure.name}:${v.structure.emojiId}> : ${v.structure.description || '(No description)'}`);
            embeds.push(new EmbedBuilder()
                .setTitle('Help command')
                .setColor("e91e63")
                .addFields(
                    { name: 'Slash commands', value: `${mapIntCmds.join('\n')}` },
                    { name: 'Prefix commands', value: `${mapPreCmds.join('\n')}` },
                    { name: 'Reaction commands', value: `${mapReactCmds.join('\n')}` }
                ));
        }
        await interaction.followUp({
            embeds: embeds
        });
    }
};