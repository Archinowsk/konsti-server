import { User, UserArray } from 'typings/user.typings';

export const getPlayerGroups = (
  players: readonly User[]
): readonly UserArray[] => {
  // Group all unique group numbers
  const groupedUsers = players.reduce((acc, player) => {
    acc[player.groupCode] = acc[player.groupCode] || [];
    acc[player.groupCode].push(player);
    return acc;
  }, {});

  const playersArray = [];
  for (const [key, value] of Object.entries(groupedUsers)) {
    if (Array.isArray(value)) {
      if (key === '0') {
        // Loop array and add players individually
        for (let i = 0; i < value.length; i++) {
          // @ts-ignore
          playersArray.push([value[i]]);
        }
      } else {
        // @ts-ignore
        playersArray.push(value);
      }
    }
  }

  return playersArray;
};
