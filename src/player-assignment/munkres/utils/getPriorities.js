/* @flow */
import type { Result } from 'flow/result.flow'

type SignupMatrix = Array<number>

const getPriorities = (
  results: Array<Result>,
  signupMatrix: Array<SignupMatrix>
) => {
  // Show the priorities players were assigned to
  const priorities = []
  for (let i = 0; i < results.length; i += 1) {
    const matrixValue = signupMatrix[results[i][0]][results[i][1]]
    const selectedPlayer = parseInt(results[i][1], 10)
    priorities.push({
      playerId: selectedPlayer,
      priorityValue: matrixValue,
    })
  }
  return priorities
}

export default getPriorities
