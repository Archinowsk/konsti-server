/* @flow */
import faker from 'faker'
import { logger } from '../../../utils/logger'
import db from '../../../db/mongodb'
import {
  getRandomInt,
  getRandomDate,
  getRandomTime,
} from './randomVariableGenerators'

const createGames = (count: number) => {
  // Create games with randomized data
  logger.info(`Generate data for ${count} games`)

  const games = []

  for (let i = 0; i < count; i += 1) {
    const minAttendance = getRandomInt(3, 4)
    const maxAttendance = getRandomInt(5, 6)
    const attendance = `${minAttendance}-${maxAttendance}`

    const gameData = {
      id: getRandomInt(100, 10000),
      title: faker.lorem.words(),
      desc: faker.lorem.sentence(),
      notes: 'Test Note',
      loc: ['203/A'],
      // date: '2017-07-28',
      // time: '20:00',
      date: getRandomDate(),
      time: getRandomTime(),
      mins: 240,
      tags: ['Pöytäpelit', 'Ei sovellu lapsille'],
      people: [{ name: 'Test GM' }],
      attendance,
      attributes: [
        'Taisteluvetoinen / Combat driven',
        'Seikkailu / Exploration',
        'Fantasia / Fantasy',
      ],
      table: '209/1',
    }
    logger.info(`Stored game "${gameData.title}"`)
    games.push(gameData)
  }

  return db.game.saveGames(games)
}

export { createGames }
