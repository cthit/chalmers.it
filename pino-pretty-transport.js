const ansis = require('ansis/colors');
const turquoise = ansis.hex('#09CDDA');

module.exports = (opts) =>
  require('pino-pretty')({
    ...opts,
    messageFormat: (log, messageKey) => turquoise(log[messageKey]),
    ignore: 'pid,hostname,name',
    customPrettifiers: {
      time: (timestamp) => ansis.blue(timestamp)
    }
  });
