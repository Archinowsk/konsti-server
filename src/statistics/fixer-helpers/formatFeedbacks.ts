import fs from 'fs';
import _ from 'lodash';
import moment from 'moment';
import { writeJson } from '../statsUtil';

export const formatFeedbacks = (year: number, event: string): void => {
  moment.locale('fi');

  const feedbacks = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/secret/feedbacks.json`,
      'utf8'
    )
  );
  console.info(`Loaded ${feedbacks.length} feedbacks`);

  const games = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/games.json`,
      'utf8'
    )
  );
  console.info(`Loaded ${games.length} games`);

  const filteredFeedbacks = feedbacks.filter(
    (feedback) => feedback.feedback !== ''
  );

  const formattedFeedbacks = filteredFeedbacks.map((feedback) => {
    const foundGame = games.find((game) => game.gameId === feedback.gameId);
    return {
      ...feedback,
      title: foundGame.title,
      people: foundGame.people,
      startTime: moment(foundGame.startTime).format('dddd HH:mm'),
    };
  });

  const groupedFeedbacks = _.groupBy(formattedFeedbacks, 'people');

  writeJson(year, event, 'feedback', groupedFeedbacks);
};
