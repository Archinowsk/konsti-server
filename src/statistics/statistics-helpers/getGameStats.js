// @flow
import fs from 'fs';
import {
  getGamesByStartingTime,
  getUsersByGames,
  getNumberOfFullGames,
  getMaximumNumberOfPlayersByTime,
  getDemandByTime,
  getSignupsByStartTime,
} from './gameDataHelpers';

export const getGameStats = (year: number, event: string) => {
  const games = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/games.json`,
      'utf8'
    )
  );
  console.info(`Loaded ${games.length} games`);

  const users = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/users.json`,
      'utf8'
    )
  );
  console.info(`Loaded ${games.length} users`);

  getGamesByStartingTime(games);

  const usersByGames = getUsersByGames(users);

  getNumberOfFullGames(games, usersByGames);

  const signupsByStartTime = getSignupsByStartTime(users);
  const maximumNumberOfPlayersByTime = getMaximumNumberOfPlayersByTime(games);
  getDemandByTime(signupsByStartTime, maximumNumberOfPlayersByTime);
};
