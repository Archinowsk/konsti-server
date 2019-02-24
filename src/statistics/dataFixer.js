import { readJson, writeJson } from './statsUtil'

const fixData = async () => {
  const data = readJson()

  // Implement fixed logic here
  data.forEach(dataEntry => {
    dataEntry.username = dataEntry.username.toUpperCase()
  })

  writeJson(data)
}

fixData()
