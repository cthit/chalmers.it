const pino = require('pino')
const pretty = require('pino-pretty')
const stream = pretty({
  colorize: true
})
const logger = pino(stream)

export {
  logger
}
