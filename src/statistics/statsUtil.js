import fs from 'fs'

export const getYear = () => {
  const year = parseInt(process.argv[2], 10)

  if (!year) {
    console.error('Give valid year parameter: 2017, 2018')
    process.exit()
  }

  return year
}

export const getType = () => {
  const getType = process.argv[3]

  if (!getType) {
    console.error('Give valid type parameter: games, results, users')
    process.exit()
  }

  return getType
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

  fs.writeFileSync(
    `src/statistics/datafiles/${year}/${type}-fixed.json`,
    JSON.stringify(data),
    'utf8'
  )

  console.info(`Saved ${data.length} ${type}`)
}
