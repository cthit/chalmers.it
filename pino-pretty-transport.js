const ansis = require('ansis');
const turquoise = ansis.hex('#09CDDA');

module.exports = (opts) =>
  require('pino-pretty')({
    ...opts,
    ignore: 'pid,hostname,name',
    customPrettifiers: {
      time: (timestamp) => turquoise(timestamp)
    }
  });
