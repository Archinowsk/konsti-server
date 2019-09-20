// @flow
import fs from 'fs'
import faker from 'faker'
import { getYear } from './statsUtil'
import { logger } from 'utils/logger'

const anonymizeData = async (): Promise<any> => {
  const year = getYear()

  const users = JSON.parse(
    fs.readFileSync(`src/statistics/datafiles/${year}/users.json`, 'utf8')
  )

  const results = JSON.parse(
    fs.readFileSync(`src/statistics/datafiles/${year}/results.json`, 'utf8')
  )

  users.forEach(user => {
    const randomUsername = faker.random.number(1000000).toString()

    results.forEach(result => {
      result.result.forEach(userResult => {
        if (user.username === userResult.username) {
          logger.info(`results.json: ${user.username} -> ${randomUsername}`)
          userResult.username = randomUsername
        }
      })
    })

    logger.info(`users.json: ${user.username} -> ${randomUsername}`)
    user.username = randomUsername
  })

  if (!fs.existsSync(`src/statistics/datafiles/${year}/temp/`)) {
    fs.mkdirSync(`src/statistics/datafiles/${year}/temp/`)
  }

  fs.writeFileSync(
    `src/statistics/datafiles/${year}/temp/users-anonymized.json`,
    JSON.stringify(users, null, 2),
    'utf8'
  )

  fs.writeFileSync(
    `src/statistics/datafiles/${year}/temp/results-anonymized.json`,
    JSON.stringify(results, null, 2),
    'utf8'
  )
}

anonymizeData()
