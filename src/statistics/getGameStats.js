import fs from 'fs'
import { getYear } from './statsUtil'

const getGameStats = () => {
  const year = getYear()

  const gameData = JSON.parse(
    fs.readFileSync(`src/statistics/datafiles/${year}/games.json`, 'utf8')
  )

  console.info(gameData.length)
  console.info(gameData[100].title)
}

getGameStats()
