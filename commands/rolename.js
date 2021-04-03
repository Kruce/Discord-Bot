module.exports = {
    name: `rolename`,
    description: `change the name of your role. Names must be 1 to 30 characters long, cannot contain certain characters, and are sanitized and trimmed of leading, trailing, and excessive internal whitespace.`,
    aliases: [`rn`], //other alias to use this command
    args: true, //arguments are required.
    usage: `*${process.env.COMMAND_PREFIX}rn [role name]*`, //how to use the command
    guildOnly: true, //usable inside servers only and not dms
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        let name = args.join(` `);
        [/@/ig, /#/ig, /:/ig, /```/ig].forEach(r => { //sanitize restricted characters
            name = name.replace(r, '');
        });

        if (name.length < 1 || name.length > 30)
            return message.channel.send(`role name must be at least 1 to 30 characters only.`);
        if ([`everyone`, `discordtag`, `here`, `server booster`].indexOf(name.toLowerCase()) > -1)
            return message.channel.send(`that name is restricted, please choose another name.`);

        const restrictedRoleIds = [`232319112141996032`, `674393490423021568`]; //`everyone` and `Server Booster` roles are restricted from role name change
        const role = message.member.roles.cache.filter(r => !restrictedRoleIds.includes(r.id)).first(); //filter out restricted roles and set the role to the only one (users have one role)
        if (role) { //if a role exists, change role name as expected, otherwise create a new role with role name
            role.setName(name)
                .then(role => console.log(`role name command successfully set name of role to ${name}`))
                .catch(e => { console.error(`role name command error setting name: ${message.guild.name} for id: ${message.guild.id}:`, e); });
        } else {
            message.guild.roles
                .create({
                    data: {
                        name: name,
                        color: `DEFAULT`,
                        position: restrictedRoleIds.length //since this is new, place it above all restricted roles highest role. since restricted roles are on the bottom and start at zero, just count all restricted roles in the restrictedRoleIds array to get position the new role should be.
                    },
                    reason: `role name command user did not have a role when trying to access command.`,
                })
                .then(r => message.member.roles.add(r)) //add new role to user requesting the role name change
                .catch(e => { console.error(`role name command error creating role for: ${message.guild.name} id: ${message.guild.id}`, e); })
                .finally(() => console.log(`role name command new role created and added to the user: ${message.member.displayName}.`));
        }
    },
};