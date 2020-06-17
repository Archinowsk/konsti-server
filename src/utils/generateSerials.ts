import generator from 'generate-serial-number';
import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import { SerialDoc } from '../typings/serial.typings';

const isInt = (n: string): boolean => parseInt(n, 10) % 1 === 0;

const generateSerials = async (): Promise<void> => {
  const serials: string[] = [];
  const count = process.argv[2];
  if (!count || !isInt(count)) {
    logger.error('Give number parameter: "npm run generate-serials 10"');
  } else {
    const countNum: number = parseInt(count, 10);
    for (let i = 1; i <= countNum; i += 1) {
      const serial: string = generator.generate(10);
      serials.push(serial);
      logger.info(`${serial}`);
    }

    try {
      await db.connectToDb();
    } catch (error) {
      logger.error(error);
    }

    try {
      const savedSerials: SerialDoc[] = await db.serial.saveSerials(serials);
      let residue: number = countNum - savedSerials.length;
      if (residue !== 0) {
        logger.info(
          `${residue} new serials already in the database. Creating more serials`
        );
        while (residue !== 0) {
          let residueSerials: string[] = [];
          for (let i = 1; i <= residue; i += 1) {
            const residueSerial = generator.generate(10);
            residueSerials.push(residueSerial);

            logger.info(`new residue serial: ${residueSerial}`);
          }

          const residueSavedSerials = await db.serial.saveSerials(
            residueSerials
          );
          residue = residue - residueSavedSerials.length;
          residueSerials = [];
        }
      }
    } catch (error) {
      logger.error(`Error saving serials: ${error}`);
    }
  }

  try {
    await db.gracefulExit();
  } catch (error) {
    logger.error(error);
  }
};

generateSerials().catch((error) => {
  logger.error(error);
});
