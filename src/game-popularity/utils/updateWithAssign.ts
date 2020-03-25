import moment from 'moment';
import _ from 'lodash';
import { db } from 'db/mongodb';
import { logger } from 'utils/logger';
import { opaAssignPlayers } from 'player-assignment/opa/opaAssignPlayers';
import { User } from 'typings/user.typings';
import { Game } from 'typings/game.typings';

export const updateWithAssign = async (
  users: readonly User[],
  games: readonly Game[]
) => {
  const groupedGames = _.groupBy(games, (game) =>
    moment(game.startTime).utc().format()
  );

  let results = [];
  _.forEach(groupedGames, (value, key) => {
    const assignmentResult = opaAssignPlayers(users, games, key);
    // @ts-ignore
    results = results.concat(assignmentResult.results);
  });

  // @ts-ignore
  const signedGames = results.flatMap(
    // @ts-ignore
    (result) => result.enteredGame.gameDetails
  );

  const groupedSignups = signedGames.reduce((acc, game) => {
    acc[game.gameId] = ++acc[game.gameId] || 1;
    return acc;
  }, {});

  try {
    await Promise.all(
      games.map(async (game) => {
        if (groupedSignups[game.gameId]) {
          await db.game.saveGamePopularity(
            game.gameId,
            groupedSignups[game.gameId]
          );
        }
      })
    );
  } catch (error) {
    logger.error(`saveGamePopularity error: ${error}`);
    throw new Error('Update game popularity error');
  }
};
