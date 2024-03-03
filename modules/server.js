const Express = require(`express`);
const Server = Express();
const Port = process.env.PORT || 3000;

Server.all("/", (req, res) => {
    res.send(`bot is running`);
})

function Listen() {
    Server.listen(Port, () => {
        console.log(`server is ready.`);
    })
}

module.exports = {
    Listen
};