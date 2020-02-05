import fs from 'fs';
import {
  getSignupsByTime,
  getMaximumNumberOfPlayersByTime,
  getDemandByTime,
} from './resultDataHelpers';

export const getResultsStats = (year: number, event: string) => {
  const results = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/results.json`,
      'utf8'
    )
  );
  console.info(`Loaded ${results.length} results`);

  const games = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/games.json`,
      'utf8'
    )
  );
  console.info(`Loaded ${games.length} games`);

  const signupsByTime = getSignupsByTime(results);
  const maximumNumberOfPlayersByTime = getMaximumNumberOfPlayersByTime(games);
  getDemandByTime(signupsByTime, maximumNumberOfPlayersByTime);
};
