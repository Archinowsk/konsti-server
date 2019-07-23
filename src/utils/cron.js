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
  popularityUpdateInterval,
} = config

export const autoUpdateGames = (): void => {
  if (autoUpdateGamesEnabled) {
    schedule.scheduleJob(
      `*/${gameUpdateInterval} * * * *`,
      async (): Promise<any> => {
        const games = await updateGames()
        await db.game.saveGames(games)
      }
    )
  }
}

export const autoUpdateGamePopularity = (): void => {
  if (autoUpdateGamePopularityEnabled) {
    schedule.scheduleJob(
      `*/${popularityUpdateInterval} * * * *`,
      async (): Promise<any> => {
        updateGamePopularity()
      }
    )
  }
}
