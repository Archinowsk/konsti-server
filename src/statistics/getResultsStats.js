// @flow
import fs from 'fs';
import { getYear, getEvent } from './statsUtil';
import {
  getSignupsByTime,
  getMaximumNumberOfPlayersByTime,
  getDemandByTime,
} from './statistics-helpers/resultDataHelpers';

const getResultsStats = () => {
  const year = getYear();
  const event = getEvent();

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

getResultsStats();
