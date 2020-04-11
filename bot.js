const Discord = require(`discord.js`);
const TinyColor = require(`tinycolor2`);
const Overwatch = require(`./overwatch`);
const client = new Discord.Client();

client.on(`ready`, () => {
  console.log(`logged in as ${client.user.tag}!`);
});

client.on(`message`, msg => {
  if (msg.content.substring(0, 1) == `!`) {
    let args = msg.content.substring(1).split(` `);
    let cmd = args[0];
    args = args.splice(1); //remove the cmd
    let content = args.join(` `);
    let message = ``;
    switch (cmd) {
      case `rit`: {
        let numbers = [`zero`, `one`, `two`, `three`, `four`, `five`, `six`, `seven`, `eight`, `nine`];
        for (var i = 0; i < content.length; i++) {
          let charCurrent = content.charAt(i);
          if (charCurrent.match(/[a-z]/i)) { //match alpha characters regardless of case
            message += `:regional_indicator_${charCurrent.toLowerCase()}:`;
          }
          else if (charCurrent.match(/\d+/)) { //match numeric characters
            message += `:${numbers[parseInt(charCurrent)]}:`;
          }
          else if (charCurrent == `?`) {
            message += `:grey_question:`;
          }
          else if (charCurrent == `!`) {
            message += `:grey_exclamation:`;
          }
          else {
            message += charCurrent;
          }
          message += ` `; //added space to display emoji correctly for mobile users
        }
        MsgDelete(msg, 1);
        MsgSend(msg, `${msg.member.displayName} ${message}`);
        break;
      }
      case `c`: {
        let color = `DEFAULT`;
        let contentUpper = content.toUpperCase();
        if (contentUpper != color) { //unless default, generate color from user's input
          let colorObj;
          if (contentUpper == `RANDOM`) {
            colorObj = TinyColor.random();
          }
          else {
            colorObj = TinyColor(contentUpper);
          }
          while (!colorObj.isValid() || (colorObj.isValid() && TinyColor.readability(`#36393F`, colorObj.toHexString()) <= 1)) { //if the colorObj is not valid, or if it is valid but not very readable when compared to discord's background color, generate a new color until one is found.
            colorObj = TinyColor.random();
          }
          color = colorObj.toHexString();
        }
        let restrictedRoleIds = [`232319112141996032`, `674393490423021568`]; //`everyone` and `Server Booster` roles are restricted from color change
        let role = msg.member.roles.cache.filter(r => !restrictedRoleIds.includes(r.id)).first(); //filter out restricted roles and set the role to the only one (users have one role)
        if (!role) { //create role if one does not exist and assign it our color and position
          msg.guild.roles
            .create({
              data: {
                name: msg.member.displayName,
                color: color,
                position: restrictedRoleIds.length //since this is new, place it above restricted role's highest role. since restricted roles are on the bottom and start at zero, just count all restricted roles in the restrictedRoleIds array.
              },
              reason: `!rc user did not have a role when trying to access command.`,
            })
            .then(r => msg.member.roles.add(r)) //add new role to user requesting the color change
            .catch(e => {
              console.log(`!rc error creating role for: ${msg.guild.name} id: ${msg.guild.id}`);
            })
            .finally(() => console.log(`!rc new role created and added to the user: ${msg.member.displayName}.`));
        }
        else { //otherwise update current role color
          role.setColor(color)
            .then(role => console.log(`!rc successfully set color of role ${role.name} to ${role.color}`))
            .catch(e => {
              console.log(`!rc error setting color: ${msg.guild.name} for id: ${msg.guild.id}`);
            });
        }
        break;
      }
      case `ow`: {
        if (content === ``) {
          var players = [];
          for (let [k, presence] of msg.guild.presences.cache) {
            var name = presence.user.username.replace(` `, `_`);
            for (let activity of presence.activities) {
              if (activity.name.trim().toUpperCase() == `OVERWATCH` && players.length <= 5) {
                players.push(name);
              }
            }
          }
          if (players.length == 0) {
            message = `no names were given & no one is currently playing overwatch.`;
          }
          else {
            message = Overwatch.PickRoles(players.join(` `));
          }
        }
        else {
          message = Overwatch.PickRoles(content);
        }
        MsgSend(msg, message);
        break;
      }
    }
  }
});

function MsgSend(msg, message) {
  msg.channel.send(message)
    .catch(e => {
      console.log(`error sending message for: ${msg.guild.name} id: ${msg.guild.id}`);
    });
}

function MsgDelete(msg, timeout) {
  msg.delete({ timeout: timeout })
    .catch(e => {
      console.log(`error deleting message for: ${msg.guild.name} for id: ${msg.guild.id}`);
    });
}

client.login(process.env.BOT_TOKEN);
