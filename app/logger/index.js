const pino = require('pino');
const logger = pino({
    level: process.env.LOG_LEVEL || "debug",
    timestamp: pino.stdTimeFunctions.isoTime
});

module.exports = logger;