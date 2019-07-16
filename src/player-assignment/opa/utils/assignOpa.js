/* @flow */
import eventassigner from 'eventassigner-js'
import _ from 'lodash'
import moment from 'moment'
import { logger } from 'utils/logger'
import type { ResultsWithMessage } from 'flow/result.flow'
import type { Input, ListItem, Group, Event } from 'flow/opaAssign.flow'
import type { UserArray, SignedGame } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'

const getGain = (signedGame: SignedGame) => {
  switch (signedGame.priority) {
    case 1:
      return 1
    case 2:
      return 0.5
    case 3:
      return 0.33
  }
}

const getList = (
  playerGroups: $ReadOnlyArray<UserArray>,
  startingTime: string
): Array<ListItem> => {
  // $FlowFixMe: Cannot call `playerGroups.flatMap` because property `flatMap` is missing in `$ReadOnlyArray` [1].
  return playerGroups.flatMap(playerGroup => {
    return _.first(playerGroup)
      .signedGames.filter(
        signedGame =>
          moment(signedGame.time).format() === moment(startingTime).format()
      )
      .map(signedGame => {
        return {
          id: _.first(playerGroup).groupCode,
          size: playerGroup.length,
          event: signedGame.gameDetails.gameId,
          gain: getGain(signedGame),
        }
      })
  })
}

export const assignOpa = (
  signedGames: $ReadOnlyArray<Game>,
  playerGroups: $ReadOnlyArray<UserArray>,
  startingTime: string
): ResultsWithMessage => {
  const groups: Array<Group> = playerGroups.map(playerGroup => {
    return {
      id: _.first(playerGroup).groupCode,
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

  console.log('groups', groups)
  console.log('events', events)
  console.log('list', list)

  const updateL = input => input.list

  const input: Input = { groups, events, list, updateL }

  const results = eventassigner.eventAssignment(input)

  logger.info(`>>>>>>>> assignment: ${JSON.stringify(results, null, 2)}`)

  const message = 'Opa assignment completed'

  return { results: [], message }
}
