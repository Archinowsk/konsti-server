import fs from 'fs'
import { getYear } from './statsUtil'

const getGameStats = () => {
  const year = getYear()

  const gameData = JSON.parse(
    fs.readFileSync(`src/statistics/datafiles/${year}/games.json`, 'utf8')
  )

  console.info(`Loaded ${gameData.length} games`)

  // Games by starting time
  const gamesByTime = gameData.reduce((acc, results) => {
    acc[results.startTime] = results.result.length
    return acc
  }, {})

  console.log(gamesByTime)
}

getGameStats()
