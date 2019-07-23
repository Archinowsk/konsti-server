/* @flow */
import schedule from 'node-schedule'
import { db } from 'db/mongodb'
import { updateGames } from 'api/controllers/gamesController'
import { config } from 'config'
import { updateGamePopularity } from 'game-popularity/updateGamePopularity'

const {
  autoUpdateGamesEnabled,
  gameUpdateInterval,
  autoUpdateGamePopularityEnabled,
} = config

export const autoUpdateGames = async (): Promise<void> => {
  if (autoUpdateGamesEnabled) {
    await schedule.scheduleJob(
      `*/${gameUpdateInterval} * * * *`,
      async (): Promise<any> => {
        const games = await updateGames()
        await db.game.saveGames(games)
      }
    )
  }

  if (autoUpdateGamePopularityEnabled) {
    await schedule.scheduleJob(
      `*/${gameUpdateInterval} * * * *`,
      async (): Promise<any> => {
        updateGamePopularity()
      }
    )
  }
}
