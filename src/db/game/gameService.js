// @flow
import _ from 'lodash';
import moment from 'moment';
import { logger } from 'utils/logger';
import { GameModel } from 'db/game/gameSchema';
import { db } from 'db/mongodb';
import type { Game } from 'flow/game.flow';

const removeGames = async (): Promise<void> => {
  logger.info('MongoDB: remove ALL games from db');
  try {
    return await GameModel.deleteMany({});
  } catch (error) {
    logger.error(`MongoDB: Error removing games - ${error}`);
    return error;
  }
};

const removeDeletedGames = async (
  updatedGames: $ReadOnlyArray<Game>
): Promise<void> => {
  const currentGames = await findGames();

  const deletedGames = _.differenceBy(currentGames, updatedGames, 'gameId');

  if (deletedGames && deletedGames.length !== 0) {
    logger.info(`Found ${deletedGames.length} deleted games, remove...`);

    try {
      await Promise.all(
        deletedGames.map(async deletedGame => {
          await GameModel.deleteOne({ gameId: deletedGame.gameId });
        })
      );
    } catch (error) {
      logger.error(`Error removing deleted games: ${error}`);
      return Promise.reject(error);
    }

    await removeDeletedGamesFromUsers();
  }
};

const removeMovedGamesFromUsers = async (
  updatedGames: $ReadOnlyArray<Game>
): Promise<void> => {
  logger.info('Remove moved games from users');
  const currentGames = await findGames();

  const movedGames = currentGames.filter(currentGame => {
    return updatedGames.find(updatedGame => {
      return (
        currentGame.gameId === updatedGame.gameId &&
        moment(currentGame.startTime).format() !==
          moment(updatedGame.startTime).format()
      );
    });
  });

  if (!movedGames || movedGames.length === 0) return;

  logger.info(`Found ${movedGames.length} moved games`);

  let users = null;
  try {
    users = await db.user.findUsers();
  } catch (error) {
    logger.error(`findUsers error: ${error}`);
    return Promise.reject(error);
  }

  try {
    await Promise.all(
      users.map(async user => {
        const signedGames = user.signedGames.filter(signedGame => {
          const movedFound = movedGames.find(movedGame => {
            return movedGame.gameId === signedGame.gameDetails.gameId;
          });
          if (!movedFound) {
            return signedGame;
          }
        });

        const enteredGames = user.enteredGames.filter(enteredGame => {
          const movedFound = movedGames.find(movedGame => {
            return movedGame.gameId === enteredGame.gameDetails.gameId;
          });
          if (!movedFound) {
            return enteredGame;
          }
        });

        if (
          user.signedGames.length !== signedGames.length ||
          user.enteredGames.length !== enteredGames.length
        ) {
          await db.user.updateUser({
            ...user,
            signedGames,
            enteredGames,
          });
        }
      })
    );
  } catch (error) {
    logger.error(`db.user.updateUser error: ${error}`);
    throw new Error('No assign results');
  }
};

export const removeDeletedGamesFromUsers = async () => {
  logger.info('Remove deleted games from users');

  let users = null;
  try {
    users = await db.user.findUsers();
  } catch (error) {
    logger.error(`findUsers error: ${error}`);
    return Promise.reject(error);
  }

  try {
    await Promise.all(
      users.map(async user => {
        const signedGames = user.signedGames.filter(signedGame => {
          return signedGame.gameDetails;
        });

        const enteredGames = user.enteredGames.filter(enteredGame => {
          return enteredGame.gameDetails;
        });

        const favoritedGames = user.favoritedGames.filter(favoritedGame => {
          return favoritedGame;
        });

        if (
          user.signedGames.length !== signedGames.length ||
          user.enteredGames.length !== enteredGames.length ||
          user.favoritedGames.length !== favoritedGames.length
        ) {
          await db.user.updateUser({
            ...user,
            signedGames,
            enteredGames,
            favoritedGames,
          });
        }
      })
    );
  } catch (error) {
    logger.error(`db.user.updateUser error: ${error}`);
    throw new Error('No assign results');
  }
};

const saveGames = async (games: $ReadOnlyArray<Game>): Promise<any> => {
  logger.info('MongoDB: Store games to DB');

  await removeDeletedGames(games);
  await removeMovedGamesFromUsers(games);

  try {
    await Promise.all(
      games.map(async game => {
        await GameModel.updateOne(
          { gameId: game.gameId },
          {
            gameId: game.gameId,
            title: game.title,
            description: game.description,
            location: game.location,
            startTime: game.startTime,
            mins: game.mins,
            tags: game.tags,
            genres: game.genres,
            styles: game.styles,
            language: game.language,
            endTime: game.endTime,
            people: game.people,
            minAttendance: game.minAttendance,
            maxAttendance: game.maxAttendance,
            gameSystem: game.gameSystem,
            englishOk: game.englishOk,
            childrenFriendly: game.childrenFriendly,
            ageRestricted: game.ageRestricted,
            beginnerFriendly: game.beginnerFriendly,
            intendedForExperiencedParticipants:
              game.intendedForExperiencedParticipants,
            shortDescription: game.shortDescription,
            revolvingDoor: game.revolvingDoor,
            programType: game.programType,
          },
          {
            upsert: true,
            setDefaultsOnInsert: true,
          }
        );
      })
    );
  } catch (error) {
    logger.error(`Error saving games to db: ${error}`);
    return Promise.reject(error);
  }

  logger.debug('MongoDB: Games saved to DB successfully');
  return findGames();
};

const findGames = async (): Promise<any> => {
  let response = null;
  try {
    response = await GameModel.find({}).lean();
    logger.debug(`MongoDB: Find all games`);
    return response;
  } catch (error) {
    logger.error(`MongoDB: Error fetching games - ${error}`);
    return error;
  }
};

const saveGamePopularity = async (
  gameId: string,
  popularity: number
): Promise<void> => {
  logger.debug(`MongoDB: Update game ${gameId} popularity to ${popularity}`);
  try {
    return await GameModel.updateOne(
      {
        gameId,
      },
      {
        popularity,
      }
    );
  } catch (error) {
    logger.error(`Error updating game popularity: ${error}`);
  }
};

export const game = { saveGames, findGames, removeGames, saveGamePopularity };
