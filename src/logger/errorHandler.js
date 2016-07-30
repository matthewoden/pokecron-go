module.exports = (e) => {
  logger.error('error',`Error at ${new Date().toString()}`)

  if (err.message) {
    logger.error('error',`Message: ${err.message}\n`)
  }

  if (err.stack) {
    logger.error('error',`Stack: ${err}\n${err.stack}\n`)
  }

  if (err.statusCode) {
    logger.error('error',`StatusCode: ${err.statusCode}\n`)
  }

  logger.error('error',`Full: ${json.stringify(err)}`)
}
