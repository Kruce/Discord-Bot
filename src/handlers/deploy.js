const { REST, Routes } = require("discord.js");
const { log, isSnowflake } = require("../functions");
const config = require("../config");
const ExtendedClient = require("../class/ExtendedClient");

/**
 *
 * @param {ExtendedClient} client
 */
module.exports = async (client) => {
    const rest = new REST({ version: "10" }).setToken(
        process.env.CLIENT_TOKEN || config.client.token
    );
    try {
        log("Deployment started ... (could take a few minutes)", "info");
        const clientId = process.env.CLIENT_ID || config.client.id;
        const guildId = process.env.GUILD_ID || config.guild.id;
        if (config.development && config.development.enabled && guildId) {
            if (!isSnowflake(guildId)) {
                log("Guild Id is missing. Please set it in .env or config file or disable development in the config", "err");
                return;
            };
            if (config.handler.deploy.remove) {
                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId), {
                    body: []
                }).then(() => log(`Removed application commands from guild ${guildId}.`, 'info'));
            }
            if (config.handler.deploy.upload) {
                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId), {
                    body: client.applicationcommandsArray,
                }).then(() => log(`Deployed application commands to guild ${guildId}.`, "info"));
            }
        } else {
            if (config.handler.deploy.remove) {
                await rest.put(
                    Routes.applicationCommands(clientId), {
                    body: []
                }).then(() => log(`Removed application commands globally from Discord api.`, 'info'));
            }
            if (config.handler.deploy.upload) {
                await rest.put(
                    Routes.applicationCommands(clientId), {
                    body: client.applicationcommandsArray,
                }).then(() => log(`Deployed application commands globally to Discord api.`, "info"));
            }
        }
    } catch (e) {
        log(`Error deploying application commands: ${e.message}`, "err");
    } finally {
        log(`... Deployment ended.`, "info");
    }
};