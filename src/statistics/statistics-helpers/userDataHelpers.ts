import { toPercent } from '../statsUtil';
import { logger } from 'utils/logger';
import { User } from 'typings/user.typings';

export const getUsersWithoutGames = (users: readonly User[]) => {
  let counter = 0;
  const usersWithoutGames = [];
  users.forEach(user => {
    if (user.enteredGames.length === 0 && user.signedGames.length !== 0) {
      // @ts-ignore
      usersWithoutGames.push(user);
      counter += 1;
    }
  });

  logger.info(
    `Players without any entered games: ${counter}/${users.length} (${toPercent(
      counter / users.length
    )}%)`
  );

  return usersWithoutGames;
};

export const getUsersWithoutSignups = (users: readonly User[]) => {
  let counter = 0;
  const usersWithoutSignups = [];
  users.forEach(user => {
    if (user.signedGames.length === 0) {
      // @ts-ignore
      usersWithoutSignups.push(user);
      counter += 1;
    }
  });

  logger.info(
    `Players without any signed games: ${counter}/${users.length} (${toPercent(
      counter / users.length
    )}%)`
  );

  return usersWithoutSignups;
};

export const getUsersSignupCount = (users: readonly User[]) => {
  const userSignupCounts = [];
  users.forEach(user => {
    const signedGames = user.signedGames.reduce((acc, signedGame) => {
      acc[signedGame.time] = ++acc[signedGame.time] || 1;
      return acc;
    }, {});
    // @ts-ignore
    userSignupCounts.push(signedGames);
  });

  const gameWishes = {};
  userSignupCounts.forEach(userSignups => {
    for (const signupTime in userSignups) {
      // @ts-ignore
      gameWishes[userSignups[signupTime]] =
        ++gameWishes[userSignups[signupTime]] || 1;
    }
  });

  logger.info(
    `Users signed for this many games when they didn't get signed:`,
    gameWishes
  );

  const signupCount = {};
  userSignupCounts.forEach(userSignups => {
    signupCount[Object.keys(userSignups).length] =
      ++signupCount[Object.keys(userSignups).length] || 1;
  });

  logger.info(
    `Users didn't get into any games after this many signup attempts:`,
    signupCount
  );
};

export const getUsersWithAllGames = (users: readonly User[]) => {
  let counter = 0;

  users.forEach(user => {
    const signedGamesByTime = user.signedGames.reduce((acc, signedGame) => {
      acc[signedGame.time] = ++acc[signedGame.time] || 1;
      return acc;
    }, {});

    if (Object.keys(signedGamesByTime).length === user.enteredGames.length) {
      counter++;
    }
  });

  logger.info(
    `This many users got into a game each time they signed up: ${counter}/${
      users.length
    } (${toPercent(counter / users.length)}%)`
  );
};
