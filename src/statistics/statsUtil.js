import logger from '/utils/logger'

export const getYear = () => {
  const year = parseInt(process.argv[2], 10)

  if (!year) {
    logger.error('Give valid year parameter, for example: 2017')
    process.exit()
  }

  return year
}
