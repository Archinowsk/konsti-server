/* @flow */
import moment from 'moment'
import _ from 'lodash'
import { opaAssignPlayers } from 'player-assignment/opa/opaAssignPlayers'
import type { User } from 'flow/user.flow'
import type { Game } from 'flow/game.flow'

export const updateWithAssign = async (
  users: $ReadOnlyArray<User>,
  games: $ReadOnlyArray<Game>
) => {
  const groupedGames = _.groupBy(games, game => moment(game.startTime).format())

  let results = []
  _.forEach(groupedGames, (value, key) => {
    const assignmentResult = opaAssignPlayers(users, games, key)
    results = results.concat(assignmentResult.results)
  })

  console.log(results)
  console.log(results.length)
}
