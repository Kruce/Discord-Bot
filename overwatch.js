module.exports = {
    GetRoles: function (msg) {
        if (WordCount(msg) <= 6 && WordCount(msg) >= 1) {
            //roles - dont worry about the order we are going to shuffle
            let role = [`healer`, `tank`, `dps`, `healer`, `dps`, `tank`];
            //get the input from the chat, this should be the players 
            var players = shuffle(msg.split(` `));
            //remove empty whitespaces
            var filteredPlayers = players.filter(function (str) { return /\S/.test(str); });
            console.log(filteredPlayers);
            var returnPlayersMessage = [];
            while (filteredPlayers.length > 0) {
                var tempRole = shuffle(role);
                var tempMessage = ` ` + filteredPlayers[0] + `: ` + tempRole[0];
                returnPlayersMessage.push(tempMessage);
                role.shift();
                filteredPlayers.shift();
            }
            return (`${returnPlayersMessage}`);
        }
        else {
            return (`ow command only takes up to six names, please try again!`);
        }
    },
};
function WordCount(str) {
    var totalSoFar = 0;
    var words = str.split(` `);
    for (var i = 0; i < words.length; i++) {
        if (words[i] !== ` ` && words[i] !== ``) {
            totalSoFar++;
        }
    }
    return totalSoFar;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}