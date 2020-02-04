import { PlayerIdWithPriority } from 'typings/user.typings';

export const getRemovedPlayer = (
  playersWithTooHighPriority: ReadonlyArray<PlayerIdWithPriority>
) => {
  const randomIndex = Math.floor(
    Math.random() * playersWithTooHighPriority.length
  );
  const removedPlayer = playersWithTooHighPriority[randomIndex];

  return removedPlayer;
};
