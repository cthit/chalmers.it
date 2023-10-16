try {
  require("./pino-pretty-transport")
} catch (e) {
  console.error("Failed to load pino-pretty-transport.js", e)
  throw e
}

const pino = require("pino");

const logger = (defaultConfig) =>
  pino({
    ...defaultConfig,
    messageKey: "message",
    transport: {
      target: "./pino-pretty-transport",
      options: {
        colorize: true,
        messageKey: "message",
      },
    },
  });

module.exports = {
  logger,
};
