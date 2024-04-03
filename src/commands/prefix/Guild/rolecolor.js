const tinycolor = require('tinycolor2');
const { Message } = require('discord.js');
const { log } = require('../../../functions/utility');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: {
        name: 'rolecolor',
        aliases: ['rc'],
        description: `Change the color of your username. `,
        usage: `Enter 1 color argument in any of the following formats of 8-digit hex, rgb, rgba, hsl, hsla, or simply the color name. Use *default* for original Discord color and *random* for a random color.`,
        permissions: 'SendMessages',
        cooldown: 1
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        let color = args.join(` `).toUpperCase();
        if (color != `DEFAULT`) { //unless default, generate color from user's input
            let colorObj = (color == `RANDOM`) ? tinycolor.random() : tinycolor(color);
            while (!colorObj.isValid() || (colorObj.isValid() && tinycolor.readability(`#36393F`, colorObj.toHexString()) <= 1)) { //if the colorObj is not valid, or if it is valid but not very readable when compared to discord's background color, generate a new color until one is found.
                colorObj = tinycolor.random();
            }
            color = colorObj.toHexString();
        }
        const restrictedRoleIds = [`232319112141996032`, `674393490423021568`]; //`everyone` and `Server Booster` roles are restricted from color change
        let role = message.member.roles.cache.filter(r => !restrictedRoleIds.includes(r.id)).first(); //filter out restricted roles and set the role to the only one (users have one role)
        if (role) { //if a role exists, change color as expected, otherwise create a new role with color
            try {
                await role.setColor(color);
                log(`Rolecolor command successfully set color of role ${role.name} to ${role.color}`, "info");
            } catch (error) {
                log(`Rolecolor command error setting color: ${message.guild.name} for id: ${message.guild.id}: \n ${error}`, "err");
            }
        } else {
            try {
                let role = await message.guild.roles.create({
                    name: message.member.displayName,
                    color: color,
                    position: restrictedRoleIds.length,
                    reason: `Rolecolor command user did not have a role when trying to assign a role color.`
                });
                await message.member.roles.add(role);
                log(`Rolecolor command new role created and added to the user: ${message.member.displayName}.`, "info");
            } catch (error) {
                log(`Rolecolor command error creating role for: ${message.guild.name} id: ${message.guild.id}: \n ${error}`, "err");
            }
        }
    },
};