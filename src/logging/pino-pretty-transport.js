const color = require("colorette")

module.exports = (opts) =>
  require("pino-pretty")({
    ...opts,
    ignore: "pid,hostname,name",
    customPrettifiers: {
      time: (timestamp) => color.blue(timestamp),
    },
  });
