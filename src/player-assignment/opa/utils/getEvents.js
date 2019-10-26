// @flow
import type { Game } from 'flow/game.flow';
import type { Event } from 'flow/opaAssign.flow';

export const getEvents = (signedGames: $ReadOnlyArray<Game>): Array<Event> => {
  return signedGames.map(signedGame => {
    return {
      id: signedGame.gameId,
      min: signedGame.minAttendance,
      max: signedGame.maxAttendance,
      groups: [],
    };
  });
};
