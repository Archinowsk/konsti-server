// @flow
import moment from 'moment';
import to from 'await-to-js';
import { logger } from 'utils/logger';
import { SettingsModel } from 'db/settings/settingsSchema';
import type { Game } from 'flow/game.flow';
import type { Settings } from 'flow/settings.flow';

const removeSettings = async (): Promise<void> => {
  logger.info('MongoDB: remove ALL settings from db');
  const [error] = await to(SettingsModel.deleteMany({}));
  if (error) throw new Error(`MongoDB: Error removing settings: ${error}`);
};

const createSettings = async (): Promise<Settings> => {
  logger.info('MongoDB: Create default settings');

  const defaultSettings = new SettingsModel();

  const [error, settings] = await to(defaultSettings.save());
  if (error) throw new Error(`MongoDB: Add default settings error: ${error}`);

  logger.info(`MongoDB: Default settings saved to DB`);
  return settings;
};

const findSettings = async (): Promise<Settings> => {
  const [error, settings] = await to(
    SettingsModel.findOne({}, '-_id -__v -createdAt -updatedAt')
      .lean()
      .populate('hiddenGames')
  );
  if (error) throw new Error(`MongoDB: Error finding settings data: ${error}`);

  if (!settings) return createSettings();

  logger.debug(`MongoDB: Settings data found`);
  return settings;
};

const saveHidden = async (
  hiddenData: $ReadOnlyArray<Game>
): Promise<Settings> => {
  const [error, settings] = await to(
    SettingsModel.findOneAndUpdate(
      {},
      {
        hiddenGames: hiddenData.map(game => {
          return game._id;
        }),
      },
      {
        new: true,
        upsert: true,
        fields: '-_id -__v -createdAt -updatedAt',
      }
    ).populate('hiddenGames')
  );
  if (error) throw new Error(`MongoDB: Error updating hidden games: ${error}`);

  logger.info(`MongoDB: Hidden data updated`);
  return settings;
};

const saveSignupTime = async (signupTime: string): Promise<Settings> => {
  const [error, settings] = await to(
    SettingsModel.findOneAndUpdate(
      {},
      {
        signupTime: signupTime ? moment(signupTime).format() : null,
      },
      { new: true, upsert: true }
    )
  );
  if (error) throw new Error(`MongoDB: Error updating signup time: ${error}`);

  logger.info(`MongoDB: Signup time updated`);
  return settings;
};

const saveToggleAppOpen = async (appOpen: boolean): Promise<Settings> => {
  const [error, settings] = await to(
    SettingsModel.findOneAndUpdate(
      {},
      {
        appOpen,
      },
      { new: true, upsert: true }
    )
  );
  if (error) throw new Error(`MongoDB: Error updating app status: ${error}`);

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
