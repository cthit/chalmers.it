const color = require("colorette")
const ansis = require("ansis/colors")
const turqoise = ansis.hex("#09CDDA")

module.exports = (opts) =>
  require("pino-pretty")({
    ...opts,
    messageFormat: (log, messageKey) => turqoise(log[messageKey]),
    ignore: "pid,hostname,name",
    customPrettifiers: {
      time: (timestamp) => ansis.blue(timestamp),
    },
  });
