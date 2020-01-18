// @flow
import { readJson, writeJson } from './statsUtil';
import { logger } from 'utils/logger';

const fixData = async (): Promise<void> => {
  let data;
  try {
    data = readJson();
  } catch (error) {
    logger.error(error);
    return;
  }

  // Implement fixer logic here
  data.forEach(dataEntry => {
    dataEntry.username = dataEntry.username.toUpperCase();
  });

  writeJson(data);
};

fixData();
