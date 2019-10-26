// @flow
import { logger } from 'utils/logger';
import { Serial } from 'db/serial/serialSchema';

const removeSerials = () => {
  logger.info('MongoDB: remove ALL serials from db');
  return Serial.deleteMany({});
};

const saveSerials = async (serials: $ReadOnlyArray<string>): Promise<any> => {
  const serialDocs = [];

  for (const serial of serials) {
    serialDocs.push(
      new Serial({
        serial,
      })
    );
  }

  let response = null;
  try {
    response = await Serial.create(serialDocs);
    logger.info(`MongoDB: Serials data saved`);
    return response;
  } catch (error) {
    logger.error(`MongoDB: Error saving serials data - ${error}`);
    return error;
  }
};

const findSerial = async (serial: string): Promise<any> => {
  let response = null;
  try {
    response = await Serial.findOne({ serial }).lean();
  } catch (error) {
    logger.error(`MongoDB: Error finding serial ${serial} - ${error}`);
    return error;
  }

  if (!response) {
    logger.info(`MongoDB: Serial "${serial}" not found`);
    return false;
  } else {
    logger.debug(`MongoDB: Found serial "${serial}"`);
    return true;
  }
};

export const serial = { removeSerials, findSerial, saveSerials };
