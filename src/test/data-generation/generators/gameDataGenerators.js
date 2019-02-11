/* @flow */
import faker from 'faker'
import moment from 'moment'
import logger from 'utils/logger'
import db from 'db/mongodb'
import {
  getRandomInt,
  getRandomStartingTime,
} from 'test/data-generation/generators/randomVariableGenerators'

const createGames = (count: number) => {
  // Create games with randomized data
  logger.info(`Generate data for ${count} games`)

  const games = []

  for (let i = 0; i < count; i += 1) {
    const minAttendance = getRandomInt(5, 5)
    const maxAttendance = getRandomInt(5, 5)

    const startTime = getRandomStartingTime()
    const length = 180

    const gameData = {
      title: faker.random.words(3),
      description: faker.lorem.sentence(),
      category_title: 'Roolipeli',
      formatted_hosts: 'Test GM',
      room_name: 'Ropetaverna',
      length,
      start_time: startTime,
      end_time: moment(startTime)
        .add(length, 'minutes')
        .format(),
      language: 'fi',
      rpg_system: 'Test gamesystem',
      no_language: false,
      english_ok: false,
      children_friendly: false,
      age_restricted: false,
      beginner_friendly: false,
      intended_for_experienced_participants: false,
      min_players: minAttendance,
      max_players: maxAttendance,
      identifier: faker.random.number().toString(),
      tags: ['aloittelijaystävällinen', 'pöytäpelit'],
      genres: ['scifi'],
      styles: ['light', 'rules_light'],
    }

    logger.info(`Stored game "${gameData.title}"`)
    games.push(gameData)
  }

  return db.game.saveGames(games)
}

export { createGames }
