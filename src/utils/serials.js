import generator from 'generate-serial-number'
import { logger } from '/utils/logger'

const checkSerial = serial => {
  const valid = generator.isValid(serial)
  return valid
}

const isInt = n => n % 1 === 0

const generateSerials = () => {
  const count = process.argv[1]
  if (count === 0 || typeof count === 'undefined' || !isInt(count)) {
    logger.error('Give number parameter: "npm run generate-serials 10"')
  } else {
    for (let i = 1; i <= process.argv[1]; i += 1) {
      const serialNumber = generator.generate(10)
      logger.info(`${serialNumber}`)
    }
  }
}

export { checkSerial, generateSerials }
