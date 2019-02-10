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
