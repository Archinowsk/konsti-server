import { logger } from 'utils/logger';
import { PlayerIdWithPriority } from 'typings/user.typings';

export const getPlayersWithTooHighPriority = (
  priorities: readonly PlayerIdWithPriority[]
) => {
  const playersWithTooHighPriority = [];

  priorities.forEach((priority) => {
    if (priority.priorityValue === 9) {
      // @ts-ignore
      playersWithTooHighPriority.push(priority);
      logger.info(`Priority too high for player ${priority.playerId}`);
    }
  });

  return playersWithTooHighPriority;
};
