import fs from 'fs'
import { getYear } from './statsUtil'

const getResultsStats = () => {
  const year = getYear()

  const resultData = JSON.parse(
    fs.readFileSync(`src/statistics/datafiles/${year}/results.json`, 'utf8')
  )

  console.info(`Loaded ${resultData.length} results`)

  // Signup by starting time
  const signupsByTime = resultData.reduce((acc, results) => {
    acc[results.startTime] = results.result.length
    return acc
  }, {})

  console.log(signupsByTime)
}

getResultsStats()
