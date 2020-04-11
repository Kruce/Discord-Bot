module.exports = {
    AssignRoles: function (content) {
        if (WordCount(content) <= 6 && WordCount(content) >= 1) {
            //roles - dont worry about the order we are going to shuffle
            let role = [`healer`, `tank`, `dps`, `healer`, `dps`, `tank`];
            //get the input from the chat, this should be the players 
            let players = shuffle(content.split(` `));
            //remove empty whitespaces
            let filteredPlayers = players.filter(function (str) { return /\S/.test(str); });
            console.log(filteredPlayers);
            let returnPlayersMessage = [];
            while (filteredPlayers.length > 0) {
                let tempRole = shuffle(role);
                let tempMessage = ` ` + filteredPlayers[0] + `: ` + tempRole[0];
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
    let totalSoFar = 0;
    let words = str.split(` `);
    for (var i = 0; i < words.length; i++) {
        if (words[i] !== ` ` && words[i] !== ``) {
            totalSoFar++;
        }
    }
    return totalSoFar;
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
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
