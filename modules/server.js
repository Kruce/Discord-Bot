const express = require(`express`);
const server = express();
const port = process.env.PORT || 3000

server.all("/", (req, res) => {
    res.send(`bot is running`);
})

function Listen() {
    server.listen(port, () => {
        console.log(`server is ready.`);
    })
}

module.exports = {
    Listen
};