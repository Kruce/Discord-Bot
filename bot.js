var Discord = require('discord.io');
var bot = new Discord.Client({
   token: process.env.BOT_TOKEN,
   autorun: true
});
bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        switch(cmd) {
            case 'rit':
                var userMessage = message.split("!rit").pop();
                var returnMessage = "";
                for (var i = 0; i < userMessage.length; i++) 
                {
                    var currentCharacter = userMessage.charAt(i);
                    if (currentCharacter.match(/[a-z]/i)) 
                    {
                        returnMessage += ":regional_indicator_" + currentCharacter.toLowerCase() + ":";
                    } 
                    else if(currentCharacter.match(/\d+/)) 
                    {
                        var numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
                        returnMessage += ":" + numbers[parseInt(currentCharacter)] + ":";
                    }
                    else if(currentCharacter == '?') 
                    {
                        returnMessage += ":grey_question:";
                    }
                    else if(currentCharacter == '!') 
                    {
                        returnMessage += ":grey_exclamation:";
                    }
                    else 
                    {
                        returnMessage += currentCharacter;
                    }
                    returnMessage += " ";
                }
                bot.sendMessage({
                    to: channelID,
                    message: user + ": " + returnMessage
                });
                bot.deleteMessage({
                    channelID: channelID,
                    messageID: evt.d.id
                  }, function (err) {
                    console.log(err)
                });
            break;
         }
     }
});
