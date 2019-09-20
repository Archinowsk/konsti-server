// @flow
import 'array-flat-polyfill'
import { server } from 'server/server'
import { logger } from 'utils/logger'
import { autoUpdateGames, autoAssignPlayers } from 'utils/cron'

// Start cronjob to auto update games from Kompassi
autoUpdateGames()

// Start cronjob to automatically assing players
autoAssignPlayers()

const app = server.listen(server.get('port'), () => {
  if (!app) return
  if (typeof process.env.NODE_ENV === 'string') {
    logger.info(`Node environment: ${process.env.NODE_ENV}`)
  } else {
    throw new Error(`Node environment NODE_ENV missing`)
  }
  logger.info(`Express: Server started on port ${app.address().port}`)
})
