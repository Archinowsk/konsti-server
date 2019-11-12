// @flow
import fs from 'fs';
import path from 'path';
import request from 'request-promise-native';
import { logger } from 'utils/logger';
import { config } from 'config';
import type { KompassiGame } from 'flow/game.flow';

export const updateGames = async (): Promise<$ReadOnlyArray<KompassiGame>> => {
  let programItems = null;

  if (config.useLocalProgramFile) {
    logger.info('Games: GET games from local filesystem');

    const rawData = fs.readFileSync(
      path.join(
        __dirname,
        '../test/kompassi-data-dumps/program-ropecon-2019.json'
      ),
      'utf8'
    );

    programItems = JSON.parse(rawData);

    logger.info(`Loaded ${programItems.length} program items`);
  } else {
    logger.info('Games: GET games from remote server');

    const options = {
      uri: config.dataUri,
      headers: {
        'User-Agent': 'Request-Promise',
      },
      json: true,
    };

    try {
      programItems = await request(options);
    } catch (error) {
      logger.error(`Games request error: ${error}`);
      return Promise.reject(error);
    }
  }

  if (!programItems) {
    logger.info('No program items found');
    return [];
  }

  return programItems.filter(programItem => {
    if (programItem.category_title === 'Roolipeli / Pen & Paper RPG') {
      return programItem;
    }
  });
};
