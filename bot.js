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
      case `ritt`: {
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
      case `rcc`: {
        let role = msg.member.roles.color || msg.member.roles.highest;
        let forbiddenRoles = [`@everyone`, `Server Booster`];
        if (role && role.name && !forbiddenRoles.includes(role.name)) {
          let messageUpper = message.toUpperCase();
          let color;
          if (messageUpper == `DEFAULT`) {
            color = messageUpper;
          }
          else {
            let colorObj;
            if (messageUpper == `RANDOM`) {
              colorObj = TinyColor.random();
            }
            else {
              colorObj = TinyColor(message);
            }
            //if the colorObj is not valid, or if it is valid but not very readable generate a better color.
            while (!colorObj.isValid || (colorObj.isValid && TinyColor.mostReadable(`#36393F`, [`#99aab5`, colorObj.toHexString()]).toHexString() == `#99aab5`)) {
              colorObj = TinyColor.random();
            }
            color = colorObj.toHexString();
          }
          role.setColor(color)
            .then(roleUp => console.log(`!rc successfully set color of role ${roleUp.name} to ${roleUp.color}`))
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
