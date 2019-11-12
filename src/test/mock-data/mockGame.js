// @flow
import mongoose from 'mongoose';

export const mockGame = {
  gameId: 'p2106',
  title: 'Test game',
  description: 'Test game description',
  location: 'Test location',
  startTime: '2018-07-28T16:00:00.000Z',
  mins: 240,
  tags: [
    'aloittelijaystävällinen',
    'english',
    'lapsiystävällinen',
    'pöytäpelit',
  ],
  genres: ['fantasy', 'war', 'exploration', 'mystery', 'drama'],
  styles: ['serious', 'story_driven', 'character_driven'],
  language: 'fi',
  endTime: '2018-07-28T20:00:00.000Z',
  people: 'Test GM',
  minAttendance: 2,
  maxAttendance: 4,
  gameSystem: 'Test gamesystem',
  englishOk: false,
  childrenFriendly: false,
  ageRestricted: false,
  beginnerFriendly: false,
  intendedForExperiencedParticipants: false,
  shortDescription: 'Short description',
  revolvingDoor: true,
  popularity: 0,
  // $FlowFixMe: Cannot call `mongoose.Types.ObjectId` because a call signature declaring the expected parameter / return type is missing in statics of `bson$ObjectId` [1].
  _id: mongoose.Types.ObjectId('testObjectId'),
};
