const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('help')
        .setDescription('View all the possible commands!')
        .addStringOption(option =>
            option.setName('slash')
                .setDescription('choose a slash type command.')
                .setAutocomplete(true)
                .setRequired(false))
        .addStringOption(option =>
            option.setName('prefix')
                .setDescription('choose a prefix type command')
                .setAutocomplete(true)
                .setRequired(false))
        .addStringOption(option =>
            option.setName('reaction')
                .setDescription('choose a reaction type command')
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
        const chosenCommand = interaction.options.get('slash') || interaction.options.get('prefix') || interaction.options.get('reaction');
        if (chosenCommand) { //get specific command
            let command = null;
            switch (chosenCommand.name) {
                case 'slash':
                    command = client.applicationcommandsArray.find((c) => c.name.startsWith(chosenCommand.value));
                    embeds.push(new EmbedBuilder()
                        .setTitle(`Slash command: \`${(command.type === 2 || command.type === 3) ? '' : '/'}${command.name}\``)
                        .addFields(
                            { name: 'Description:', value: `${command.description || '(No description)'}` },
                            { name: 'Options:', value: command.options.join('\n') }
                        ));
                    break;
                case 'prefix':
                    command = client.collection.prefixcommands.find((c) => c.structure.name.startsWith(chosenCommand.value));
                    embeds.push(new EmbedBuilder()
                        .setTitle(`Prefix command: \`${prefix}${command.structure.name}\``)
                        .addFields(
                            { name: 'Description:', value: `${command.structure.description || '(No description)'}` },
                            { name: 'Aliases:', value: `${command.structure.aliases.join('\n') || '(No aliases)'}` },
                            { name: 'Usage:', value: `${command.structure.usage || '(No usage)'}` },
                            { name: 'Cooldown:', value: `${command.structure.cooldown}` },
                        ));
                    break;
                case 'reaction':
                    command = client.applicationcommandsArray.find((c) => c.name.startsWith(chosenCommand.value));
                    embeds.push(new EmbedBuilder()
                        .setTitle(`Reaction command: \`${(command.type === 2 || command.type === 3) ? '' : '/'}${command.name}\``)
                        .addFields(
                            { name: 'Description:', value: `${command.description || '(No description)'}` },
                            { name: 'Options:', value: command.options.join('\n') }
                        ));
                    break;
            }
        } else { //get all commands
            const mapIntCmds = client.applicationcommandsArray.map((v) => `\`${(v.type === 2 || v.type === 3) ? '' : '/'}${v.name}\`: ${v.description || '(No description)'}`);
            const mapPreCmds = client.collection.prefixcommands.map((v) => `\`${prefix}${v.structure.name}\` (${v.structure.aliases.length > 0 ? v.structure.aliases.map((a) => `**${a}**`).join(', ') : 'None'}): ${v.structure.description || '(No description)'}`);
            const mapReactCmds = client.collection.reactions.map((v) => `<:${v.structure.name}:${v.structure.emojiId}> : ${v.structure.description || '(No description)'}`);
            embeds.push(new EmbedBuilder()
                .setTitle('Help command')
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