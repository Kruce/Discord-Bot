const Discord = require(`discord.js`);
const TinyColor = require(`tinycolor2`);
const client = new Discord.Client();

client.on(`ready`, () => {
  console.log(`logged in as ${client.user.tag}!`);
});

client.on(`message`, msg => {
  if (msg.content.substring(0, 1) == `!`) {
    var args = msg.content.substring(1).split(` `);
    var cmd = args[0];
    args = args.splice(1);
    var message = args.join(` `);
    switch (cmd) {
      case `rit`: {
        let numbers = [`zero`, `one`, `two`, `three`, `four`, `five`, `six`, `seven`, `eight`, `nine`];
        let returnMessage = ``;
        for (var i = 0; i < message.length; i++) {
          let currentCharacter = message.charAt(i);
          if (currentCharacter.match(/[a-z]/i)) { //match alpha characters regardless of case
            returnMessage += `:regional_indicator_${currentCharacter.toLowerCase()}:`;
          }
          else if (currentCharacter.match(/\d+/)) { //match numeric characters
            returnMessage += `:${numbers[parseInt(currentCharacter)]}:`;
          }
          else if (currentCharacter == `?`) {
            returnMessage += `:grey_question:`;
          }
          else if (currentCharacter == `!`) {
            returnMessage += `:grey_exclamation:`;
          }
          else {
            returnMessage += currentCharacter;
          }
          returnMessage += ` `; //added space to display emoji correctly for mobile users
        }
        msg.delete({ timeout: 1 })
          .catch(e => {
            console.log(`!rit error deleting message for: ${msg.guild.name} for id: ${msg.guild.id}`);
          });
        msg.channel.send(msg.member.displayName + ` ` + returnMessage)
          .catch(e => {
            console.log(`!rit error sending message for: ${msg.guild.name} id: ${msg.guild.id}`);
          });
        break;
      }
      case `rc`: {
        let role = msg.member.roles.color || msg.member.roles.highest;
        let forbiddenRoleIds = [`232319112141996032`, `674393490423021568`]; //'everyone' and 'Server Booster' roles cannot be changed
        if (role && role.id && !forbiddenRoleIds.includes(role.id)) {
          let color = `DEFAULT`;
          let messageUpper = message.toUpper();
          if (messageUpper != color) {
            let colorObj;
            if (messageUpper == `RANDOM`) {
              colorObj = TinyColor.random();
            }
            else {
              colorObj = TinyColor(messageUpper);
            }
            //if the colorObj is not valid, or if it is valid but not very readable when compared to discord's background color, generate a new color until one is found.
            while (!colorObj.isValid() || (colorObj.isValid() && TinyColor.readability(`#36393F`, colorObj.toHexString()) <= 1)) {
              colorObj = TinyColor.random();
            }
            color = colorObj.toHexString();
          }
          role.setColor(color)
            .then(role => console.log(`!rc successfully set color of role ${role.name} to ${role.color}`))
            .catch(e => {
              console.log(`!rc error setting color: ${msg.guild.name} for id: ${msg.guild.id}`);
            });
        }
        break;
      }
    }
  }
});

client.login(process.env.BOT_TOKEN);
