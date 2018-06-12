// const { logger } = require('../../../utils/logger')

const getPriorities = (results, signupMatrix) => {
  // Show the priorities players were assigned to
  const priorities = []
  for (let i = 0; i < results.length; i += 1) {
    const matrixValue = signupMatrix[results[i][0]][results[i][1]]
    const selectedPlayer = parseInt(results[i][1], 10)
    priorities.push({ playerId: selectedPlayer, priorityValue: matrixValue })
    // logger.info(`Priority for player ${selectedPlayer}: ${matrixValue}`);
  }
  return priorities
}

module.exports = getPriorities
