// @flow
import type { PlayerIdWithPriority } from 'flow/user.flow';

export const getRemovedPlayer = (
  playersWithTooHighPriority: $ReadOnlyArray<PlayerIdWithPriority>
) => {
  const randomIndex = Math.floor(
    Math.random() * playersWithTooHighPriority.length
  );
  const removedPlayer = playersWithTooHighPriority[randomIndex];

  return removedPlayer;
};
