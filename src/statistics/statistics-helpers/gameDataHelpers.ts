import moment from 'moment';
import { toPercent } from '../statsUtil';
import { logger } from 'utils/logger';
import { Game } from 'typings/game.typings';
import { User } from 'typings/user.typings';

export const getGamesByStartingTime = (games: ReadonlyArray<Game>) => {
  const gamesByTime = games.reduce((acc, game) => {
    acc[game.startTime] = ++acc[game.startTime] || 1;
    return acc;
  }, {});

  logger.info(`Number of games for each start time: \n`, gamesByTime);
  return gamesByTime;
};

export const getUsersByGames = (users: ReadonlyArray<User>) => {
  const enteredGames = users.reduce((acc, user) => {
    user.enteredGames.forEach(enteredGame => {
      acc[enteredGame.gameDetails.gameId] =
        ++acc[enteredGame.gameDetails.gameId] || 1;
    });
    return acc;
  }, {});

  // logger.info(enteredGames)
  return enteredGames;
};

export const getNumberOfFullGames = (
  games: ReadonlyArray<Game>,
  users: ReadonlyArray<User>
) => {
  const usersByGames = getUsersByGames(users);

  let counter = 0;
  games.forEach(game => {
    if (
      parseInt(game.maxAttendance, 10) ===
      parseInt(usersByGames[game.gameId], 10)
    ) {
      counter++;
    }
  });

  logger.info(
    `Games with maximum number of players: ${counter}/${
      games.length
    } (${toPercent(counter / games.length)}%)`
  );
};

export const getSignupsByStartTime = (users: ReadonlyArray<User>) => {
  const userSignupCountsByTime = {};

  logger.warn('Warning: inaccurate because forming groups deletes signedGames');

  users.forEach(user => {
    let groupSize = 1;

    if (user.groupCode !== '0' && user.groupCode === user.serial) {
      groupSize = users.filter(groupUser => groupUser.groupCode === user.serial)
        .length;
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

export const getMaximumNumberOfPlayersByTime = (games: ReadonlyArray<Game>) => {
  const maxNumberOfPlayersByTime = {};
  games.forEach(game => {
    if (!maxNumberOfPlayersByTime[game.startTime]) {
      maxNumberOfPlayersByTime[game.startTime] = 0;
    }

    maxNumberOfPlayersByTime[game.startTime] =
      parseInt(maxNumberOfPlayersByTime[game.startTime], 10) +
      parseInt(game.maxAttendance, 10);
  });

  /*
  logger.info(
    `Maximum number of seats by starting times: \n`,
    maxNumberOfPlayersByTime
  )
  */

  return maxNumberOfPlayersByTime;
};

export const getDemandByTime = (
  games: ReadonlyArray<Game>,
  users: ReadonlyArray<User>
) => {
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
  games: ReadonlyArray<Game>,
  users: ReadonlyArray<User>
) => {
  logger.info('>>> Demand by games');

  const signedGames = users.reduce((acc, user) => {
    let groupSize = 1;
    if (user.groupCode !== '0' && user.groupCode === user.serial) {
      groupSize = users.filter(groupUser => groupUser.groupCode === user.serial)
        .length;
    }

    user.signedGames.forEach(signedGame => {
      const game = games.find(
        game => game.gameId === signedGame.gameDetails.gameId
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
