import fs from 'fs'
import moment from 'moment'
import { getYear, getType } from './statsUtil'

const getUserStats = async () => {
  const year = getYear()
  const type = getType()

  const data = JSON.parse(
    fs.readFileSync(`src/statistics/datafiles/${year}/${type}.json`, 'utf8')
  )

  console.info(`Loaded ${data.length} ${type}`)

  data.forEach(dataEntry => {
    const timestamp = moment(
      parseInt(dataEntry.startTime['$date']['$numberLong'])
    )

    dataEntry.startTime = timestamp.format()
  })

  fs.writeFileSync(
    `src/statistics/datafiles/${year}/${type}-fixed.json`,
    JSON.stringify(data),
    'utf8'
  )
}

getUserStats()
