// @flow
import moment from 'moment';
import { logger } from 'utils/logger';
import { SettingsModel } from 'db/settings/settingsSchema';
import type { Game } from 'flow/game.flow';
import type { SettingsType } from 'flow/settings.flow';

const removeSettings = async (): Promise<void> => {
  logger.info('MongoDB: remove ALL settings from db');
  await SettingsModel.deleteMany({});
  await createSettings();
};

const createSettings = async (): Promise<any> => {
  logger.info('MongoDB: Create default "Settings" collection');

  const settings = new SettingsModel();

  let response = null;
  try {
    response = await settings.save();
    logger.info(`MongoDB: Empty settings collection saved to DB`);
    return response;
  } catch (error) {
    logger.error(
      `MongoDB: Error creating empty settings collection - ${error}`
    );
    return error;
  }
};

const findSettings = async (): Promise<SettingsType> => {
  let response = null;
  try {
    response = await SettingsModel.findOne(
      {},
      '-_id -__v -createdAt -updatedAt'
    )
      .lean()
      .populate('hiddenGames');
  } catch (error) {
    logger.error(`MongoDB: Error finding settings data - ${error}`);
    return error;
  }

  if (response === null) {
    // No settings data, create new collection
    return createSettings();
  }
  logger.debug(`MongoDB: Settings data found`);
  return response;
};

const saveHidden = async (
  hiddenData: $ReadOnlyArray<Game>
): Promise<SettingsType> => {
  let response = null;
  try {
    response = await SettingsModel.findOneAndUpdate(
      {},
      {
        hiddenGames: hiddenData.map(game => {
          return game._id;
        }),
      },
      { new: true, fields: '-_id -__v -createdAt -updatedAt' }
    ).populate('hiddenGames');
  } catch (error) {
    logger.error(`MongoDB: Error updating hidden data - ${error}`);
    return error;
  }

  logger.info(`MongoDB: Hidden data updated`);
  return response;
};

const saveSignupTime = async (signupTime: string): Promise<SettingsType> => {
  const formattedTime = moment(signupTime).format();

  let response = null;
  try {
    response = await SettingsModel.findOneAndUpdate(
      {},
      {
        signupTime: signupTime ? formattedTime : null,
      },
      { new: true }
    );
    logger.info(`MongoDB: Signup time updated`);
    return response;
  } catch (error) {
    logger.error(`MongoDB: Error updating signup time - ${error}`);
    return error;
  }
};

const saveToggleAppOpen = async (appOpen: boolean): Promise<SettingsType> => {
  let response = null;
  try {
    response = await SettingsModel.findOneAndUpdate(
      {},
      {
        appOpen,
      },
      { new: true }
    );
    logger.info(`MongoDB: Toggle app open updated`);
    return response;
  } catch (error) {
    logger.error(`MongoDB: Error updating toggle app open - ${error}`);
    return error;
  }
};

export const settings = {
  findSettings,
  removeSettings,
  saveHidden,
  saveSignupTime,
  saveToggleAppOpen,
  createSettings,
};
