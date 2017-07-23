const generator = require('generate-serial-number');
const logger = require('../utils/logger').logger;

const checkSerial = serial => {
  const valid = generator.isValid(serial);
  return valid;
};

for (let i = 1; i <= 10; i += 1) {
  const serialNumber = generator.generate(10); // '8380289275'
  logger.info(`Serial ${i}: ${serialNumber}`);
}

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

module.exports = checkSerial;
