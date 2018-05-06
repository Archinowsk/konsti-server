const logger = require('../../../utils/logger').logger
const db = require('../../../db/mongodb')
const getRandomInt = require('./randomVariableGenerators').getRandomInt
const getRandomString = require('./randomVariableGenerators').getRandomString
const getRandomDate = require('./randomVariableGenerators').getRandomDate
const getRandomTime = require('./randomVariableGenerators').getRandomTime

const createGames = count => {
  // Create games with randomized data
  logger.info(`Generate data for ${count} games`)

  const games = []

  for (let i = 0; i < count; i += 1) {
    const minAttendance = getRandomInt(3, 4)
    const maxAttendance = getRandomInt(5, 6)
    const attendance = `${minAttendance}-${maxAttendance}`

    const gameData = {
      id: getRandomInt(100, 10000),
      title: getRandomString(20),
      desc: getRandomString(30),
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
    logger.info(`Stored game ${gameData.title}`)
    games.push(gameData)
  }

  return db.storeGamesData(games)
}

module.exports = { createGames }
