/* @flow */
import fs from 'fs'

const getType = () => {
  const type = process.argv[3]

  if (!type) {
    throw new Error(
      'Give valid type parameter: games, results, users, feedbacks'
    )
  }

  return type
}

export const getYear = () => {
  const year = parseInt(process.argv[2], 10)

  if (!year) {
    throw new Error('Give valid year parameter: 2017, 2018, 2019')
  }

  return year
}

export const readJson = () => {
  const year = getYear()
  const type = getType()

  const data = JSON.parse(
    fs.readFileSync(`src/statistics/datafiles/${year}/${type}.json`, 'utf8')
  )

  console.info(`Loaded ${data.length} ${type}`)
  return data
}

export const writeJson = (data: Array<any> | Object) => {
  const year = getYear()
  const type = getType()

  if (!fs.existsSync(`src/statistics/datafiles/${year}/temp/`)) {
    fs.mkdirSync(`src/statistics/datafiles/${year}/temp/`)
  }

  fs.writeFileSync(
    `src/statistics/datafiles/${year}/temp/${type}-fixed.json`,
    JSON.stringify(data, null, 2),
    'utf8'
  )

  console.info(
    `Saved ${data.length} ${type} to file src/statistics/datafiles/${year}/temp/${type}-fixed.json`
  )
}

export const toPercent = (num: number) => {
  return Math.round(num * 100)
}
