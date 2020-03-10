import mongoose from 'mongoose';
import { Game } from 'typings/game.typings';

// @ts-ignore
interface GameDoc extends Game, mongoose.Document {}

const gameSchema = new mongoose.Schema(
  {
    gameId: String,
    title: String,
    description: String,
    location: String,
    startTime: Date,
    mins: Number,
    tags: Array,
    genres: Array,
    styles: Array,
    language: String,
    endTime: Date,
    people: String,
    minAttendance: Number,
    maxAttendance: Number,
    gameSystem: String,
    englishOk: Boolean,
    childrenFriendly: Boolean,
    ageRestricted: Boolean,
    beginnerFriendly: Boolean,
    intendedForExperiencedParticipants: Boolean,
    shortDescription: String,
    revolvingDoor: Boolean,
    popularity: { type: Number, default: 0 },
    programType: String,
  },
  { timestamps: true }
);

export const GameModel = mongoose.model<GameDoc>('Game', gameSchema);
