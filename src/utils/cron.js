/* @flow */
import schedule from 'node-schedule'
import { db } from 'db/mongodb'
import { updateGames } from 'api/controllers/gamesController'
import { config } from 'config'

export const autoUpdateGames = (): void => {
  if (config.autoUpdateGamesEnabled) {
    // Update games from master data every n minutes
    schedule.scheduleJob(
      `*/${config.gameUpdateInterval} * * * *`,
      async (): Promise<any> => {
        const games = await updateGames()
        await db.game.saveGames(games)
      }
    )
  }
}
