// @flow
import fs from 'fs';
import _ from 'lodash';
import moment from 'moment';
import { getYear, writeJson } from './statsUtil';

const formatFeedbacks = () => {
  moment.locale('fi');
  const year = getYear();

  const feedbacks = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${year}/secret/feedbacks.json`,
      'utf8'
    )
  );
  console.info(`Loaded ${feedbacks.length} feedbacks`);

  const games = JSON.parse(
    fs.readFileSync(`src/statistics/datafiles/${year}/games.json`, 'utf8')
  );
  console.info(`Loaded ${games.length} games`);

  const formattedFeedbacks = feedbacks.map(feedback => {
    const foundGame = games.find(game => game.gameId === feedback.gameId);
    return {
      ...feedback,
      title: foundGame.title,
      people: foundGame.people,
      startTime: moment(foundGame.startTime).format('dddd HH:mm'),
    };
  });

  const groupedFeedbacks = _.groupBy(formattedFeedbacks, 'people');

  writeJson(groupedFeedbacks);
};

formatFeedbacks();
