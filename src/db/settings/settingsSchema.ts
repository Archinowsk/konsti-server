import mongoose from 'mongoose';

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

export const SettingsModel = mongoose.model('Settings', SettingsSchema);
