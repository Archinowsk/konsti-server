import 'array-flat-polyfill';
import { startServer } from 'server/server';
import { logger } from 'utils/logger';
import { autoUpdateGames, autoAssignPlayers } from 'utils/cron';
import { config } from 'config';

const startApp = async (): Promise<void> => {
  autoUpdateGames(); // Start cronjob to auto update games from Kompassi
  autoAssignPlayers(); // Start cronjob to automatically assing players

  const server = await startServer(config.dbConnString);

  const app = server.listen(server.get('port'), () => {
    if (!app) return;
    logger.info(`Express: Server started on port ${app.address().port}`);
  });
};

const init = (): void => {
  if (typeof process.env.NODE_ENV === 'string') {
    logger.info(`Node environment: ${process.env.NODE_ENV}`);
  } else {
    throw new Error(`Node environment NODE_ENV missing`);
  }

  startApp();
};

init();
