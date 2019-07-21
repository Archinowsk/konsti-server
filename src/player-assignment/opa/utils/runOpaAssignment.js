/* @flow */
import { assignOpa } from 'player-assignment/opa/utils/assignOpa'
import { getGroups } from 'player-assignment/opa/utils/getGroups'
import { getList } from 'player-assignment/opa/utils/getList'
import { getEvents } from 'player-assignment/opa/utils/getEvents'
import { formatResults } from 'player-assignment/opa/utils/formatResults'
import type { AssignmentStrategyResult } from 'flow/result.flow'
import type { UserArray } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'

export const runOpaAssignment = (
  signedGames: $ReadOnlyArray<Game>,
  playerGroups: $ReadOnlyArray<UserArray>,
  startingTime: string
): AssignmentStrategyResult => {
  const groups = getGroups(playerGroups, startingTime)
  const events = getEvents(signedGames)
  const list = getList(playerGroups, startingTime)
  const updateL = input => input.list

  const assignResults = assignOpa(groups, events, list, updateL)

  if (!assignResults) {
    throw new Error('Opa assignment error')
  }

  const results = formatResults(assignResults, playerGroups)

  const message = 'Opa assignment completed'

  return { results, message }
}
