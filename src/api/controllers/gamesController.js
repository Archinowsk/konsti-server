// @flow
import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import { validateAuthHeader } from 'utils/authHeader';
import { updateGames } from 'utils/updateGames';
import { updateGamePopularity } from 'game-popularity/updateGamePopularity';
import { config } from 'config';
import type { $Request, $Response, Middleware } from 'express';

// Update games db from master data
const postGames: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: POST /api/games');

  const authHeader = req.headers.authorization;
  const validToken = validateAuthHeader(authHeader, 'admin');

  if (!validToken) {
    return res.sendStatus(401);
  }

  let games = [];
  try {
    games = await updateGames();
  } catch (error) {
    return res.json({
      message: 'Games db update failed',
      status: 'error',
    });
  }

  if (!games || games.length === 0) {
    return res.json({
      message: 'Games db update failed: No games available',
      status: 'error',
    });
  }

  logger.info(`Found ${games.length} games`);

  let gameSaveResponse = null;
  try {
    gameSaveResponse = await db.game.saveGames(games);
  } catch (error) {
    logger.error(`db.game.saveGames error: ${error}`);
    return res.json({
      message: 'Games db update failed: Saving games failed',
      status: 'error',
    });
  }

  if (!gameSaveResponse) {
    return res.json({
      message: 'Games db update failed: No save response',
      status: 'error',
    });
  }

  if (config.updateGamePopularityEnabled) {
    try {
      await updateGamePopularity();
    } catch (error) {
      logger.error(`updateGamePopularity: ${error}`);
      return res.json({
        message: 'Game popularity update failed',
        status: 'error',
      });
    }
  }

  return res.json({
    message: 'Games db updated',
    status: 'success',
    games: gameSaveResponse,
  });
};

// Get games from db
const getGames: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: GET /api/games');

  let games = null;
  try {
    games = await db.game.findGames();

    return res.json({
      message: 'Games downloaded',
      status: 'success',
      games: games,
    });
  } catch (error) {
    return res.json({
      message: 'Downloading games failed',
      status: 'error',
      response: error,
    });
  }
};

export { postGames, getGames, updateGames };
