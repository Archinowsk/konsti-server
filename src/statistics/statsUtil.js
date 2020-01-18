// @flow
import fs from 'fs';

export const readJson = (
  year: number,
  event: string,
  datatype: string
): Array<any> => {
  const data = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/${datatype}.json`,
      'utf8'
    )
  );

  console.info(`Loaded ${data.length} ${datatype}`);
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

export const writeJson = (
  year: number,
  event: string,
  datatype: string,
  data: Array<any> | Object
): void => {
  if (!fs.existsSync(`src/statistics/datafiles/${event}/${year}/temp/`)) {
    fs.mkdirSync(`src/statistics/datafiles/${event}/${year}/temp/`);
  }

  fs.writeFileSync(
    `src/statistics/datafiles/${event}/${year}/temp/${datatype}-fixed.json`,
    JSON.stringify(data, null, 2),
    'utf8'
  );

  console.info(
    `Saved ${getDataLength(
      data
    )} ${datatype} to file src/statistics/datafiles/${event}/${year}/temp/${datatype}-fixed.json`
  );
};

export const toPercent = (num: number): number => {
  return Math.round(num * 100);
};
