const generator = require('generate-serial-number');
const logger = require('../utils/logger').logger;

const checkSerial = serial => {
  const valid = generator.isValid(serial);
  return valid;
};

const isInt = n => n % 1 === 0;

const generateSerials = () => {
  const count = process.argv[1];
  if (count === 0 || typeof count === 'undefined' || !isInt(count)) {
    logger.error('Give number parameter: "npm run generate-serials 10"');
  } else {
    for (let i = 1; i <= process.argv[1]; i += 1) {
      const serialNumber = generator.generate(10);
      logger.info(`Serial ${i}: ${serialNumber}`);
    }
  }
};

/*
const generate = () => {
  // https://github.com/hachi-eiji/generate-serial-number
  const serialNumber = generator.generate(10); // '8380289275'
  const checkSum = generator.checkSum(serialNumber);
  const valid = generator.isValid('123399aaa');

  logger.info(`serialNumber: ${serialNumber}`);
  logger.info(`checkSum: ${checkSum}`);
  logger.info(`valid: ${valid}`);
};
*/

module.exports = { checkSerial, generateSerials };
