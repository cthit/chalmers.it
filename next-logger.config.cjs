try {
  require('./pino-pretty-transport.cjs');
} catch (e) {
  console.error('Failed to load pino-pretty-transport.cjs', e);
  throw e;
}

const pino = require('pino');

const logger = (defaultConfig) =>
  pino({
    ...defaultConfig,
    messageKey: 'message',
    transport: {
      target: './pino-pretty-transport.cjs',
      options: {
        colorize: true,
        messageKey: 'message'
      }
    }
  });

module.exports = {
  logger
};
