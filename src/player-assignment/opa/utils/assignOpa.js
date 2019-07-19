/* @flow */
import eventassigner from 'eventassigner-js'
import _ from 'lodash'
import moment from 'moment'
import { logger } from 'utils/logger'
import type { AssignmentStrategyResult } from 'flow/result.flow'
import type {
  Input,
  ListItem,
  Group,
  Event,
  OpaAssignResults,
} from 'flow/opaAssign.flow'
import type { UserArray, SignedGame } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'

export const assignOpa = (
  signedGames: $ReadOnlyArray<Game>,
  playerGroups: $ReadOnlyArray<UserArray>,
  startingTime: string
): AssignmentStrategyResult => {
  const groups: Array<Group> = playerGroups.map(playerGroup => {
    return {
      id:
        _.first(playerGroup).groupCode !== '0'
          ? _.first(playerGroup).groupCode
          : _.first(playerGroup).serial,
      size: playerGroup.length,
      pref: _.first(playerGroup)
        .signedGames.filter(
          signedGame =>
            moment(signedGame.time).format() === moment(startingTime).format()
        )
        .map(signedGame => signedGame.gameDetails.gameId),
    }
  })

  const events: Array<Event> = signedGames.map(signedGame => {
    return {
      id: signedGame.gameId,
      min: signedGame.minAttendance,
      max: signedGame.maxAttendance,
      groups: [],
    }
  })

  const list: Array<ListItem> = getList(playerGroups, startingTime).sort(
    (a, b) => {
      if (a.gain >= b.gain) {
        return 1
      } else {
        return -1
      }
    }
  )

  const updateL = input => input.list

  const input: Input = { groups, events, list, updateL }
  const assignResults: OpaAssignResults = eventassigner.eventAssignment(input)

  const selectedPlayers = playerGroups
    .filter(playerGroup => {
      return assignResults.find(
        assignResult =>
          (assignResult.id === _.first(playerGroup).groupCode ||
            assignResult.id === _.first(playerGroup).serial) &&
          assignResult.assignment !== -1
      )
    })
    // $FlowFixMe: Cannot call `playerGroups.filter(...).flat` because property `flat` is missing in `Array` [1].
    .flat()

  const results = selectedPlayers.map(player => {
    return {
      username: player.username,
      enteredGame: player.signedGames.find(signedGame =>
        assignResults.find(
          assignResult =>
            (assignResult.id === player.groupCode ||
              assignResult.id === player.serial) &&
            assignResult.assignment === signedGame.gameDetails.gameId
        )
      ),
    }
  })

  const message = 'Opa assignment completed'
  logger.info(message)

  return { results, message }
}

const getList = (
  playerGroups: $ReadOnlyArray<UserArray>,
  startingTime: string
): Array<ListItem> => {
  return playerGroups.flatMap(playerGroup => {
    return _.first(playerGroup)
      .signedGames.filter(
        signedGame =>
          moment(signedGame.time).format() === moment(startingTime).format()
      )
      .map(signedGame => {
        return {
          id:
            _.first(playerGroup).groupCode !== '0'
              ? _.first(playerGroup).groupCode
              : _.first(playerGroup).serial,
          size: playerGroup.length,
          event: signedGame.gameDetails.gameId,
          gain: getGain(signedGame),
        }
      })
  })
}

const getGain = (signedGame: SignedGame) => {
  switch (signedGame.priority) {
    case 1:
      return 1
    case 2:
      return 0.5
    case 3:
      return 0.33
  }

  throw new Error(`Invalid signup priority: ${signedGame.priority}`)
}
