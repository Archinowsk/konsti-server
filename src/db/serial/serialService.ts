import { logger } from 'utils/logger';
import { SerialModel } from 'db/serial/serialSchema';

const removeSerials = () => {
  logger.info('MongoDB: remove ALL serials from db');
  return SerialModel.deleteMany({});
};

const saveSerials = async (serials: ReadonlyArray<string>): Promise<void> => {
  const serialDocs = [];

  for (const serial of serials) {
    serialDocs.push(
      new SerialModel({
        serial,
      })
    );
  }

  let response = null;
  try {
    response = await SerialModel.create(serialDocs);
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
    response = await SerialModel.findOne({ serial }).lean();
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
