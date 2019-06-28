import fs from 'fs'

const getType = () => {
  const getType = process.argv[3]

  if (!getType) {
    console.error('Give valid type parameter: games, results, users')
    process.exit()
  }

  return getType
}

export const getYear = () => {
  const year = parseInt(process.argv[2], 10)

  if (!year) {
    console.error('Give valid year parameter: 2017, 2018')
    process.exit()
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

export const writeJson = data => {
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

  console.info(`Saved ${data.length} ${type}`)
}

export const toPercent = num => {
  return Math.round(num * 100)
}
