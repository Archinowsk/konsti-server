import moment from 'moment';
import { toPercent } from '../statsUtil';
import { logger } from 'utils/logger';
import { Game } from 'typings/game.typings';
import { User } from 'typings/user.typings';
import { getMaximumNumberOfPlayersByTime } from './resultDataHelpers';

export const getGamesByStartingTime = (games: readonly Game[]): any => {
  const gamesByTime = games.reduce((acc, game) => {
    acc[game.startTime] = ++acc[game.startTime] || 1;
    return acc;
  }, {});

  logger.info(`Number of games for each start time: \n`, gamesByTime);
  return gamesByTime;
};

const getUsersByGames = (users: readonly User[]): any => {
  const enteredGames = users.reduce((acc, user) => {
    user.enteredGames.forEach((enteredGame) => {
      acc[enteredGame.gameDetails.gameId] =
        ++acc[enteredGame.gameDetails.gameId] || 1;
    });
    return acc;
  }, {});

  // logger.info(enteredGames)
  return enteredGames;
};

export const getNumberOfFullGames = (
  games: readonly Game[],
  users: readonly User[]
): void => {
  const usersByGames = getUsersByGames(users);

  let counter = 0;
  games.forEach((game) => {
    if (game.maxAttendance === parseInt(usersByGames[game.gameId], 10)) {
      counter++;
    }
  });

  logger.info(
    `Games with maximum number of players: ${counter}/${
      games.length
    } (${toPercent(counter / games.length)}%)`
  );
};

const getSignupsByStartTime = (users: readonly User[]): any => {
  const userSignupCountsByTime = {};

  logger.warn('Warning: inaccurate because forming groups deletes signedGames');

  users.forEach((user) => {
    let groupSize = 1;

    if (user.groupCode !== '0' && user.groupCode === user.serial) {
      groupSize = users.filter(
        (groupUser) => groupUser.groupCode === user.serial
      ).length;
    }

    const signedGames = user.signedGames.reduce((acc, signedGame) => {
      acc[signedGame.time] = acc[signedGame.time] + 1 || 1;
      return acc;
    }, {});

    for (const signupTime in signedGames) {
      userSignupCountsByTime[signupTime] =
        userSignupCountsByTime[signupTime] + groupSize || groupSize;
    }
  });

  // logger.info(`Total number of signups by time: \n`, userSignupCountsByTime)
  return userSignupCountsByTime;
};

export const getDemandByTime = (
  games: readonly Game[],
  users: readonly User[]
): void => {
  logger.info('>>> Demand by time');
  const signupsByTime = getSignupsByStartTime(users);
  const maximumNumberOfPlayersByTime = getMaximumNumberOfPlayersByTime(games);

  for (const startTime in maximumNumberOfPlayersByTime) {
    logger.info(
      `Demand for ${moment(startTime).format('DD.M.YYYY HH:mm')}: ${
        signupsByTime[startTime]
      }/${maximumNumberOfPlayersByTime[startTime]} (${toPercent(
        signupsByTime[startTime] / maximumNumberOfPlayersByTime[startTime]
      )}%)`
    );
  }
};

export const getDemandByGame = (
  games: readonly Game[],
  users: readonly User[]
): void => {
  logger.info('>>> Demand by games');

  const signedGames = users.reduce((acc, user) => {
    let groupSize = 1;
    if (user.groupCode !== '0' && user.groupCode === user.serial) {
      groupSize = users.filter(
        (groupUser) => groupUser.groupCode === user.serial
      ).length;
    }

    user.signedGames.forEach((signedGame) => {
      const game = games.find(
        (game) => game.gameId === signedGame.gameDetails.gameId
      );

      if (!game) return;

      acc[game.title] = {
        first:
          acc[game.title] && acc[game.title].first ? acc[game.title].first : 0,
        second:
          acc[game.title] && acc[game.title].second
            ? acc[game.title].second
            : 0,
        third:
          acc[game.title] && acc[game.title].third ? acc[game.title].third : 0,
      };

      if (signedGame.priority === 1) {
        acc[game.title].first = acc[game.title].first + groupSize;
      } else if (signedGame.priority === 2) {
        acc[game.title].second = ++acc[game.title].second + groupSize;
      } else if (signedGame.priority === 3) {
        acc[game.title].third = ++acc[game.title].third + groupSize;
      }
    });
    return acc;
  }, {});

  logger.info(JSON.stringify(signedGames, null, 2));
};
