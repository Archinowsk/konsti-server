// @flow
import fs from 'fs';

const getType = () => {
  const type = process.argv[3];

  if (!type) {
    throw new Error(
      'Give valid type parameter: games, results, users, feedbacks'
    );
  }

  return type;
};

export const getYear = () => {
  const year = parseInt(process.argv[2], 10);

  if (!year) {
    throw new Error('Give valid year parameter: 2017, 2018, 2019');
  }

  return year;
};

export const getEvent = () => {
  const event = process.argv[4];

  if (!event) {
    throw new Error('Give valid year parameter: ropecon, tracon-hitpoint');
  }

  return event;
};

export const readJson = () => {
  const year = getYear();
  const type = getType();
  const event = getEvent();

  const data = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/${type}.json`,
      'utf8'
    )
  );

  console.info(`Loaded ${data.length} ${type}`);
  return data;
};

const getDataLength = (data: Array<any> | Object): number => {
  if (Array.isArray(data)) {
    return data.length;
  } else {
    let sum = 0;
    Object.keys(data).forEach((key, index) => {
      sum += data[key].length;
    });
    return sum;
  }
};

export const writeJson = (data: Array<any> | Object) => {
  const year = getYear();
  const type = getType();
  const event = getEvent();

  if (!fs.existsSync(`src/statistics/datafiles/${event}/${year}/temp/`)) {
    fs.mkdirSync(`src/statistics/datafiles/${event}/${year}/temp/`);
  }

  fs.writeFileSync(
    `src/statistics/datafiles/${event}/${year}/temp/${type}-fixed.json`,
    JSON.stringify(data, null, 2),
    'utf8'
  );

  console.info(
    `Saved ${getDataLength(
      data
    )} ${type} to file src/statistics/datafiles/${event}/${year}/temp/${type}-fixed.json`
  );
};

export const toPercent = (num: number) => {
  return Math.round(num * 100);
};
