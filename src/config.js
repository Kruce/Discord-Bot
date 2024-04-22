module.exports = {
    client: {
        token: process.env.CLIENT_TOKEN,
        id: process.env.CLIENT_ID,
    },
    guild: {
        id: process.env.GUILD_ID,
        name: process.env.GUILD_NAME
    },
    handler: {
        prefix: process.env.PREFIX,
        deploy: {
            upload: true,
            remove: false
        },
        commands: {
            prefix: true,
            slash: true,
            user: false,
            message: false,
        },
        reactions: true,
        mongodb: {
            enabled: true,
            uri: ""
        },
    },
    users: {
        developers: [process.env.DEVELOPER_IDS],
    },
    development: { 
        enabled: true,
        guild: process.env.GUILD_ID,
    }, 
    messageSettings: {
        nsfwMessage: "the current channel is not a NSFW channel.",
        developerMessage: "you are not authorized to use this command.",
        cooldownMessage: "please wait before using this command. cooldown: ({cooldown}s).",
        globalCooldownMessage: "please wait before using this command. global cooldown: ({cooldown}s).",
        notHasPermissionMessage: "you do not have the permission to use this command.",
        notHasPermissionComponent: "you do not have the permission to use this component.",
        missingDevIDsMessage: "this is a developer only command, but unable to execute due to missing user IDs in configuration file."
    }
};