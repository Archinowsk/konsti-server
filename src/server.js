import schedule from 'node-schedule'
import app from 'app'
import logger from 'utils/logger'
import db from 'db/mongodb'
import { updateGames } from 'api/controllers/gamesController'

if (process.env.NODE_ENV === 'production') {
  // Update games from master data every 5 minutes
  schedule.scheduleJob('*/5 * * * *', async () => {
    const games = await updateGames()
    await db.game.saveGames(games)
  })
}

const server = app.listen(app.get('port'), () => {
  if (!server) return
  logger.info(`Node environment: ${process.env.NODE_ENV}`)
  logger.info(`Express: Server started on port ${server.address().port}`)
})

export default server
