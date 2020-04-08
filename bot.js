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
    var userMessage = args.join(' ');
    switch (cmd) {
      case 'rit':
        var numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        var returnMessage = "";
        for (var i = 0; i < userMessage.length; i++) {
          var currentCharacter = userMessage.charAt(i);
          if (currentCharacter.match(/[a-z]/i)) {
            returnMessage += ":regional_indicator_" + currentCharacter.toLowerCase() + ":";
          }
          else if (currentCharacter.match(/\d+/)) {
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
          returnMessage += " "; //Added space to display emoji correctly for mobile users
        }
        msg.delete({timeout:1});
        msg.channel.send(msg.member.displayName + " " + returnMessage);
        break;
      case 'rc':
        var role = msg.member.roles.color;
        if (role && role.name && role.name != "@everyone" && role.name != "Server Booster" && userMessage.match(/#([a-f0-9]{3}){1,2}\b/i)) {
          role.setColor(userMessage)
            .then(updated => console.log(`Set color of role ${updated.name} to ${updated.color}`))
            .catch(console.error);
        }
        break;
    }
  }
});

client.login(process.env.BOT_TOKEN);
