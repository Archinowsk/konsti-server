import mongoose from 'mongoose';
import { Settings } from 'typings/settings.typings';

interface SettingsDoc extends Settings, mongoose.Document {}

const SettingsSchema = new mongoose.Schema(
  {
    hiddenGames: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Game', default: [] },
    ],
    signupTime: { type: Date, default: null },
    appOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SettingsModel = mongoose.model<SettingsDoc>(
  'Settings',
  SettingsSchema
);
