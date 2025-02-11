const tinycolor = require('tinycolor2');
const { Message } = require('discord.js');
const { log } = require('../../../functions/utility');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: {
        name: 'rolename',
        aliases: ['rn'],
        description: `Change the name of your role. `,
        usage: `Enter 1 argument as your desired role name. Argument must be 1 to 30 characters long, cannot contain certain characters, and are sanitized and trimmed of leading, trailing, and excessive internal whitespace.`,
        permissions: 'SendMessages',
        cooldown: 1
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        let name = args.join(` `);
        [/@/ig, /#/ig, /:/ig, /```/ig].forEach(r => { //sanitize restricted characters
            name = name.replace(r, '');
        });

        const serverBooster = message.guild.roles.premiumSubscriberRole;
        const everyone = message.guild.roles.everyone;
        if (name.length < 1 || name.length > 30)
            return await message.channel.send(`role name must be at least 1 to 30 characters only.`);
        if ([everyone.name.toLowerCase(), `discordtag`, `here`, serverBooster.name.toLowerCase()].indexOf(name.toLowerCase()) > -1)
            return await message.channel.send(`that name is restricted, please choose another name.`);

        const restrictedRoleIds = [everyone.id, serverBooster.id]; //`everyone` and `Server Booster` roles are restricted from role name change
        const role = message.member.roles.cache.filter(r => !restrictedRoleIds.includes(r.id)).first(); //filter out restricted roles and set the role to the only one (users have one role)
        if (role) { //if a role exists, change role name as expected, otherwise create a new role with role name
            try {
                await role.setName(name);
                log(`Rolename command successfully set name of role to ${name}`, "info");
            } catch (error) {
                log(`Rolename command error setting role name: ${message.guild.name} for the user: ${message.member.displayName}.\n ${error}`, "err");
            }
        } else {
            try {
                let role = await message.guild.roles.create({
                    name: name,
                    color: `DEFAULT`,
                    position: restrictedRoleIds.length,
                    reason: `Rolename command user did not have a role when trying to access command.`
                });
                await message.member.roles.add(role);
                log(`Rolename command successfully created a new role and added it to user: ${message.member.displayName}.`, "info");
            } catch (error) {
                log(`Rolename command error setting role name: ${message.guild.name} for the user: ${message.member.displayName}.\n ${error}`, "err");
            }
        }
    },
};