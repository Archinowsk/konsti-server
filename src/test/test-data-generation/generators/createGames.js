// @flow
import faker from 'faker';
import moment from 'moment';
import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import { config } from 'config';
import { kompassiGameMapper } from 'utils/kompassiGameMapper';

const startingTimes = [
  moment(config.CONVENTION_START_TIME)
    .add(2, 'hours')
    .format(),

  moment(config.CONVENTION_START_TIME)
    .add(3, 'hours')
    .format(),

  moment(config.CONVENTION_START_TIME)
    .add(7, 'hours')
    .format(),
];

export const createGames = (count: number): Promise<void> => {
  logger.info(`Generate data for ${count} games`);

  const kompassiGames = [];

  startingTimes.forEach(startingTime => {
    for (let i = 0; i < count; i += 1) {
      const minAttendance = faker.random.number({ min: 3, max: 4 });
      const maxAttendance = faker.random.number({ min: 4, max: 6 });
      const startTime = startingTime;
      const length = 180;

      const gameData = {
        title: faker.random.words(3),
        description: faker.lorem.sentences(5),
        category_title: 'Roolipeli',
        formatted_hosts: faker.internet.userName(),
        room_name: 'Ropetaverna',
        length,
        start_time: moment(startTime).format(),
        end_time: moment(startTime)
          .add(length, 'minutes')
          .format(),
        language: 'fi',
        rpg_system: 'Test gamesystem',
        no_language: true,
        english_ok: true,
        children_friendly: true,
        age_restricted: true,
        beginner_friendly: true,
        intended_for_experienced_participants: true,
        min_players: minAttendance,
        max_players: maxAttendance,
        identifier: faker.random.number().toString(),
        tags: [
          'in-english',
          'sopii-lapsille',
          'vain-taysi-ikaisille',
          'aloittelijaystavallinen',
          'kunniavieras',
          'perheohjelma',
        ],
        genres: ['fantasy', 'war', 'exploration', 'mystery', 'drama'],
        styles: ['serious', 'story_driven', 'character_driven'],
        short_blurb: faker.lorem.sentence(),
        revolving_door: true,
        three_word_description: 'This is example ',
        is_beginner_friendly: true,
      };

      logger.info(`Stored game "${gameData.title}"`);
      kompassiGames.push(gameData);
    }
  });

  return db.game.saveGames(kompassiGameMapper(kompassiGames));
};
