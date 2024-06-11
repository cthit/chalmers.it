const ansis = require('ansis/colors');
const turquoise = ansis.hex('#09CDDA');

module.exports = (opts) =>
  require('pino-pretty')({
    ...opts,
    ignore: 'pid,hostname,name',
    customPrettifiers: {
      time: (timestamp) => turquoise(timestamp)
    }
  });
