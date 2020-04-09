const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.substring(0, 1) == '!') {
    var args = msg.content.substring(1).split(' ');
    var cmd = args[0];
    args = args.splice(1);
    var message = args.join(' ');
    switch (cmd) {
      case 'rit': {
        let numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        let returnMessage = "";
        for (var i = 0; i < message.length; i++) {
          let currentCharacter = message.charAt(i);
          if (currentCharacter.match(/[a-z]/i)) { //match alpha characters regardless of case
            returnMessage += ":regional_indicator_" + currentCharacter.toLowerCase() + ":";
          }
          else if (currentCharacter.match(/\d+/)) { //match numeric characters
            returnMessage += ":" + numbers[parseInt(currentCharacter)] + ":";
          }
          else if (currentCharacter == '?') {
            returnMessage += ":grey_question:";
          }
          else if (currentCharacter == '!') {
            returnMessage += ":grey_exclamation:";
          }
          else {
            returnMessage += currentCharacter;
          }
          returnMessage += " "; //added space to display emoji correctly for mobile users
        }
        msg.delete({ timeout: 1 })
          .catch(e => {
            console.log("error deleting message for: " + msg.guild.name + " ID: " + msg.guild.id);
          });
        msg.channel.send(msg.member.displayName + " " + returnMessage)
          .catch(e => {
            console.log("error sending message for: " + msg.guild.name + " ID: " + msg.guild.id);
          });
        break;
      }
      case 'rc': {
        let role = msg.member.roles.color || msg.member.roles.highest;
        let forbiddenRoles = ['@everyone', 'Server Booster'];
        if (role && role.name && !forbiddenRoles.includes(role.name)) {
          message = message.toUpperCase();
          if (!message.match(/#([a-f0-9]{3}){1,2}\b/i)) {
            let validColors = ['DEFAULT', 'WHITE', 'AQUA', 'GREEN', 'BLUE', 'YELLOW', 'PURPLE', 'LUMINOUS_VIVID_PINK', 'GOLD', 'ORANGE', 'RED', 'GREY', 'DARKER_GREY', 'NAVY', 'DARK_AQUA', 'DARK_GREEN', 'DARK_BLUE', 'DARK_PURPLE', 'DARK_VIVID_PINK', 'DARK_GOLD', 'DARK_ORANGE', 'DARK_RED', 'DARK_GREY', 'LIGHT_GREY', 'DARK_NAVY', 'RANDOM'];
            if (!validColors.includes(message)) {
              message = "RANDOM";
            }
          }
          role.setColor(message)
            .then(updatedRole => console.log(`Set color of role ${updatedRole.name} to ${updatedRole.color}`))
            .catch(e => {
              console.log("error setting color: " + msg.guild.name + " ID: " + msg.guild.id);
            });
        }
        break;
      }
    }
  }
});

client.login(process.env.BOT_TOKEN);
