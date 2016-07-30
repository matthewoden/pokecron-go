const winston = require('winston')
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    // new (winston.transports.File)({
    //   filename: './.logs/info.log',
    //   tags: ['PokeCron-Go'],
    // }),
  ]
});

process.on('uncaughtException', (err) => {
  logger.error(`Unexpected error: ${err}`);
  logger.log('error', 'Stack trace dumped to console');
  console.trace(err);
  process.exit(1);
});

logger.level = process.env.NODE_ENV === 'debug' ? 'debug' : 'info';
// Live forever, my child.
logger.exitOnError = false;
logger.log('silly', 'Logger Initialized')

module.exports = logger
