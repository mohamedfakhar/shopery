const logger = (req, res, next) => {
  const now  = new Date().toISOString()
  const method = req.method.padEnd(7)
  console.log(`[${now}]  ${method}  ${req.originalUrl}`)
  next()
}

module.exports = logger
