const turquoise = (str) => `\u001b[38;5;45m${str}\u001b[0m`;

module.exports = (opts) =>
  require('pino-pretty')({
    ...opts,
    ignore: 'pid,hostname,name',
    customPrettifiers: {
      time: turquoise
    }
  });
