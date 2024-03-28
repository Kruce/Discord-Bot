require('dotenv').config();
const server = require('./server');
const ExtendedClient = require('./class/ExtendedClient');

const client = new ExtendedClient();

client.start();

// Handles errors and avoids crashes
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);