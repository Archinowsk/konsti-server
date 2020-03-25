import moment from 'moment';
import { logger } from 'utils/logger';
import { SettingsModel } from 'db/settings/settingsSchema';
import { Game } from 'typings/game.typings';
import { Settings } from 'typings/settings.typings';

const removeSettings = async (): Promise<void> => {
  logger.info('MongoDB: remove ALL settings from db');
  try {
    await SettingsModel.deleteMany({});
  } catch (error) {
    throw new Error(`MongoDB: Error removing settings: ${error}`);
  }
};

const createSettings = async (): Promise<Settings> => {
  logger.info('MongoDB: Create default settings');

  const defaultSettings = new SettingsModel();

  let settings;
  try {
    settings = await defaultSettings.save();
  } catch (error) {
    throw new Error(`MongoDB: Add default settings error: ${error}`);
  }

  logger.info(`MongoDB: Default settings saved to DB`);
  return settings;
};

const findSettings = async (): Promise<Settings> => {
  let settings;
  try {
    settings = await SettingsModel.findOne(
      {},
      '-_id -__v -createdAt -updatedAt'
    )
      .lean()
      .populate('hiddenGames');
  } catch (error) {
    throw new Error(`MongoDB: Error finding settings data: ${error}`);
  }

  if (!settings) return await createSettings();

  logger.debug(`MongoDB: Settings data found`);
  return settings;
};

const saveHidden = async (hiddenData: readonly Game[]): Promise<Settings> => {
  let settings;
  try {
    settings = await SettingsModel.findOneAndUpdate(
      {},
      {
        hiddenGames: hiddenData.map((game) => {
          return game._id;
        }),
      },
      {
        new: true,
        upsert: true,
        fields: '-_id -__v -createdAt -updatedAt',
      }
    ).populate('hiddenGames');
  } catch (error) {
    throw new Error(`MongoDB: Error updating hidden games: ${error}`);
  }

  logger.info(`MongoDB: Hidden data updated`);
  return settings;
};

const saveSignupTime = async (signupTime: string): Promise<Settings> => {
  let settings;
  try {
    settings = await SettingsModel.findOneAndUpdate(
      {},
      {
        signupTime: signupTime ? moment(signupTime).format() : null,
      },
      { new: true, upsert: true }
    );
  } catch (error) {
    throw new Error(`MongoDB: Error updating signup time: ${error}`);
  }

  logger.info(`MongoDB: Signup time updated`);
  return settings;
};

const saveToggleAppOpen = async (appOpen: boolean): Promise<Settings> => {
  let settings;
  try {
    settings = await SettingsModel.findOneAndUpdate(
      {},
      {
        appOpen,
      },
      { new: true, upsert: true }
    );
  } catch (error) {
    throw new Error(`MongoDB: Error updating app status: ${error}`);
  }

  logger.info(`MongoDB: App open status updated`);
  return settings;
};

export const settings = {
  findSettings,
  removeSettings,
  saveHidden,
  saveSignupTime,
  saveToggleAppOpen,
  createSettings,
};
