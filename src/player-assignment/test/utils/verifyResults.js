// @flow
import moment from 'moment';
import { logger } from 'utils/logger';
import type { ResultsCollectionEntry } from 'flow/result.flow';
import type { User } from 'flow/user.flow';

export const verifyResults = async (
  startTime: string,
  users: Array<User>,
  results: ResultsCollectionEntry
): Promise<void> => {
  logger.info(`Verify results for time ${startTime}`);

  if (!users) {
    logger.error(`No users found`);
    return;
  }

  if (!results) {
    logger.error(`No results found for time ${startTime}`);
    return;
  }

  logger.info(`Found ${results.results.length} results for this time`);

  results.results.map(result => {
    if (
      moment(result.enteredGame.time).format() !== moment(startTime).format()
    ) {
      logger.error(
        `Invalid time for "${
          result.enteredGame.gameDetails.title
        }" - actual: ${moment(
          result.enteredGame.time
        ).format()}, expected: ${startTime}`
      );
    }
  });

  logger.info('Check if user enteredGames match results');
  users.forEach(user => {
    // console.log(`user: ${user.username}`)
    user.enteredGames.forEach(enteredGame => {
      if (moment(enteredGame.time).format() === moment(startTime).format()) {
        /*
        logger.info(
          `Found entered game "${enteredGame.gameDetails.title}" for user "${user.username}"`
        )
        */

        if (!results || !results.results) {
          logger.error(
            `No results or results.results found for time ${startTime}`
          );
          return;
        }

        const matchingResult = results.results.find(result => {
          if (!enteredGame.gameDetails) {
            logger.error(`Game details missing for entered game`);
          }

          if (!result.enteredGame.gameDetails) {
            logger.error(`Game details missing for result`);
            console.log(result);
          }

          if (
            enteredGame.gameDetails &&
            result.enteredGame.gameDetails &&
            enteredGame.gameDetails.gameId ===
              result.enteredGame.gameDetails.gameId &&
            user.username === result.username
          ) {
            /*
            logger.info(
              `Match for game ${enteredGame.gameDetails.title} and user ${user.username}`
            )
            */

            return result;
          }
        });

        if (!matchingResult) {
          logger.error(
            `No matching result for user "${user.username}" and game "${enteredGame.gameDetails.title}"`
          );
        }
      }
    });
  });

  logger.info('Check if results match user enteredGames');

  results.results.forEach(result => {
    if (!users) {
      logger.error(`No users found`);
      return;
    }

    if (!result.enteredGame.gameDetails) {
      logger.error(`Game details missing for result`);
      console.log(result);
      return;
    }

    users.forEach(user => {
      // console.log(`user: ${user.username}`)

      /*
      if (user.enteredGames.length === 0) {
        return
      }
      */

      if (user.username === result.username) {
        let gameFound = false;
        user.enteredGames.forEach(enteredGame => {
          if (
            moment(enteredGame.time).format() === moment(startTime).format()
          ) {
            gameFound = true;
            /*
            logger.info(
              `Found entered game "${enteredGame.gameDetails.title}" for user "${user.username}"`
            )
            */

            if (!enteredGame.gameDetails) {
              logger.error(`Game details missing for entered game`);
            }

            if (
              enteredGame.gameDetails.gameId ===
              result.enteredGame.gameDetails.gameId
            ) {
              /*
              logger.info(
                `Match for game ${enteredGame.gameDetails.title} and user ${user.username}`
              )
              */
            } else {
              logger.error(
                `No matching result for user "${user.username}": enteredGame: "${enteredGame.gameDetails.title}", result: "${result.enteredGame.gameDetails.title}"`
              );
            }
          }
        });

        if (!gameFound) {
          logger.error(
            `No entered game found for user "${user.username}" and result "${result.enteredGame.gameDetails.title}"`
          );
        }
      }
    });
  });

  logger.info('Verify results done');
};
