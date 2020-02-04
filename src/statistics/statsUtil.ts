import fs from 'fs';
import prettier from 'prettier';
import { logger } from 'utils/logger';

export const readJson = (
  year: number,
  event: string,
  datatype: string
): any[] => {
  const data = JSON.parse(
    fs.readFileSync(
      `src/statistics/datafiles/${event}/${year}/${datatype}.json`,
      'utf8'
    )
  );

  logger.info(`Loaded ${data.length} ${datatype}`);
  return data;
};

export const writeJson = (
  year: number,
  event: string,
  datatype: string,
  data: any[] | Object
): void => {
  if (!fs.existsSync(`src/statistics/datafiles/${event}/${year}/temp/`)) {
    fs.mkdirSync(`src/statistics/datafiles/${event}/${year}/temp/`);
  }

  fs.writeFileSync(
    `src/statistics/datafiles/${event}/${year}/temp/${datatype}-fixed.json`,
    prettier.format(JSON.stringify(data), { parser: 'json' }),
    'utf8'
  );

  logger.info(
    `Saved ${getDataLength(
      data
    )} ${datatype} to file src/statistics/datafiles/${event}/${year}/temp/${datatype}-fixed.json`
  );
};

export const toPercent = (num: number): number => {
  return Math.round(num * 100);
};

const getDataLength = (data: any[] | Object): number => {
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
