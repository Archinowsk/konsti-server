// @flow
import fs from 'fs';
import faker from 'faker';
import { logger } from 'utils/logger';

export const anonymizeData = async (
  year: number,
  event: string
): Promise<void> => {
  const users = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/users.json`,
      'utf8'
    )
  );

  const results = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/results.json`,
      'utf8'
    )
  );

  users.forEach(user => {
    const randomUsername = faker.random.number(1000000).toString();

    results.forEach(result => {
      result.result.forEach(userResult => {
        if (user.username === userResult.username) {
          logger.info(`results.json: ${user.username} -> ${randomUsername}`);
          userResult.username = randomUsername;
        }
      });
    });

    logger.info(`users.json: ${user.username} -> ${randomUsername}`);
    user.username = randomUsername;
  });

  if (!fs.existsSync(`src/statistics/datafiles/${event}/${year}/temp/`)) {
    fs.mkdirSync(`src/statistics/datafiles/${event}/${year}/temp/`);
  }

  fs.writeFileSync(
    `src/statistics/datafiles/${event}/${year}/temp/users-anonymized.json`,
    JSON.stringify(users, null, 2),
    'utf8'
  );

  fs.writeFileSync(
    `src/statistics/datafiles/${event}/${year}/temp/results-anonymized.json`,
    JSON.stringify(results, null, 2),
    'utf8'
  );
};
