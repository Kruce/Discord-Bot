var http = require('http');
const { log } = require('./functions');
const Port = process.env.PORT || 3000;

http.createServer(function (req, res) {
    res.write("bot is running");
    res.end();
}).listen(Port, () => {
    log("Server is running and listening to port.", "info");
});