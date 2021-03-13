const TinyColor = require(`tinycolor2`);
module.exports = {
    name: `role`,
    description: `Change the color of your username. Color input accepts a string as one of multiple formats of 8-digit hex, rgb, rgba, hsl, hsla, or simply the color name. Use *default* for original Discord color and *random* for a random color.`,
    aliases: [`r`], //other alias to use this command
    args: true, //arguments are required.
    usage: `Examples: *${process.env.PREFIX}r red*, *${process.env.PREFIX}r #ff0000*, *${process.env.PREFIX}r ff0000*, *${process.env.PREFIX}r rgb (255, 0, 0)*, *${process.env.PREFIX}r rgb 255 0 0*, *${process.env.PREFIX}r hsl(0, 100%, 50%)*, *${process.env.PREFIX}r random*, *${process.env.PREFIX}r default*`, //how to use the command
    guildOnly: true, //usable inside servers only and not dms
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        let color = args.join(` `).toUpperCase();
        if (color != `DEFAULT`) { //unless default, generate color from user's input
            let colorObj = (color == `RANDOM`) ? TinyColor.random() : TinyColor(color);
            while (!colorObj.isValid() || (colorObj.isValid() && TinyColor.readability(`#36393F`, colorObj.toHexString()) <= 1)) { //if the colorObj is not valid, or if it is valid but not very readable when compared to discord's background color, generate a new color until one is found.
                colorObj = TinyColor.random();
            }
            color = colorObj.toHexString();
        }
        const restrictedRoleIds = [`232319112141996032`, `674393490423021568`]; //`everyone` and `Server Booster` roles are restricted from color change
        const role = message.member.roles.cache.filter(r => !restrictedRoleIds.includes(r.id)).first(); //filter out restricted roles and set the role to the only one (users have one role)
        if (role) { //if a role exists, change color as expected, otherwise create a new role with color
            role.setColor(color)
                .then(role => console.log(`color command successfully set color of role ${role.name} to ${role.color}`))
                .catch(e => { console.error(`color command error setting color: ${message.guild.name} for id: ${message.guild.id}:`, e); });
        }
        else {
            message.guild.roles
                .create({
                    data: {
                        name: message.member.displayName,
                        color: color,
                        position: restrictedRoleIds.length //since this is new, place it above all restricted roles highest role. since restricted roles are on the bottom and start at zero, just count all restricted roles in the restrictedRoleIds array to get position the new role should be.
                    },
                    reason: `color command user did not have a role when trying to access command.`,
                })
                .then(r => message.member.roles.add(r)) //add new role to user requesting the color change
                .catch(e => { console.error(`color command error creating role for: ${message.guild.name} id: ${message.guild.id}`, e); })
                .finally(() => console.log(`color command new role created and added to the user: ${message.member.displayName}.`));
        }
    },
};