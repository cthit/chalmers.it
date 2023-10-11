const pino = require("pino");

const logger = (defaultConfig) =>
  pino({
    ...defaultConfig,
    messageKey: "message",
    transport: {
      target: "./src/logging/pino-pretty-transport",
      options: {
        colorize: true,
        messageKey: "message",
      },
    },
  });

module.exports = {
  logger,
};
