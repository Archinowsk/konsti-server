/* @flow */
import fs from 'fs'
import logger from '/utils/logger'

const getResultsStats = () => {
  const resultData = JSON.parse(
    fs.readFileSync('src/statistics/datafiles/results.json', 'utf8')
  )

  logger.info(`Loaded ${resultData.length} results`)

  // Signup by starting time
  const signupsByTime = resultData.reduce((acc, results) => {
    acc[results.startTime] = results.result.length
    return acc
  }, {})

  console.log(signupsByTime)
}

getResultsStats()
