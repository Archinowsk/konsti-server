/* @flow */
import 'array-flat-polyfill'
import { app } from 'app'
import { logger } from 'utils/logger'
import { autoUpdateGames, autoAssignPlayers } from 'utils/cron'

// Start cronjob to auto update games from Kompassi
autoUpdateGames()

// Start cronjob to automatically assing players
autoAssignPlayers()

const server = app.listen(app.get('port'), () => {
  if (!server) return
  if (typeof process.env.NODE_ENV === 'string') {
    logger.info(`Node environment: ${process.env.NODE_ENV}`)
  } else {
    logger.error(`Node environment (NODE_ENV) missing`)
    process.exit()
  }
  logger.info(`Express: Server started on port ${server.address().port}`)
})
