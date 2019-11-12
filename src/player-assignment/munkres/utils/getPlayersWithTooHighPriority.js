// @flow
import { logger } from 'utils/logger';
import type { PlayerIdWithPriority } from 'flow/user.flow';

export const getPlayersWithTooHighPriority = (
  priorities: $ReadOnlyArray<PlayerIdWithPriority>
) => {
  const playersWithTooHighPriority = [];

  priorities.forEach(priority => {
    if (priority.priorityValue === 9) {
      playersWithTooHighPriority.push(priority);
      logger.info(`Priority too high for player ${priority.playerId}`);
    }
  });

  return playersWithTooHighPriority;
};
