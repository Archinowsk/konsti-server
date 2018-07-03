/* @flow */
import fs from 'fs'
import { logger } from '/utils/logger'

const getUserStats = () => {
  const userData = JSON.parse(
    fs.readFileSync('src/statistics/datafiles/users.json', 'utf8')
  )

  logger.info(userData.length)
  logger.info(userData[100].username)
}

getUserStats()
