import app from 'app'
import logger from 'utils/logger'

const server = app.listen(app.get('port'), () => {
  if (!server) return
  logger.info(`Node environment: ${process.env.NODE_ENV}`)
  logger.info(`Express: Server started on port ${server.address().port}`)
})

export default server
