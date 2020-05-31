import { logger } from 'utils/logger';
import { SerialModel } from 'db/serial/serialSchema';
import { SerialDoc, Serial } from 'typings/serial.typings';

const removeSerials = async (): Promise<void> => {
  logger.info('MongoDB: remove ALL serials from db');
  await SerialModel.deleteMany({});
};

const saveSerials = async (
  serials: readonly string[]
): Promise<SerialDoc[]> => {
  const serialDocs = [] as SerialDoc[];

  for (const serial of serials) {
    serialDocs.push(
      new SerialModel({
        serial,
      })
    );
  }

  let response;
  try {
    response = await SerialModel.create(serialDocs);
    logger.info(`MongoDB: Serials data saved`);
    return response;
  } catch (error) {
    logger.error(`MongoDB: Error saving serials data - ${error}`);
    return error;
  }
};

const findSerial = async (serial: string): Promise<Serial | boolean> => {
  let response;
  try {
    response = await SerialModel.findOne({ serial }).lean<Serial>();
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
