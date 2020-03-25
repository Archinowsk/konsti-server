import moment from 'moment';
import { db } from 'db/mongodb';

export const removeOldEnteredGames = async (
  startingTime: string
): Promise<void> => {
  let users;
  try {
    users = await db.user.findUsers();
  } catch (error) {
    throw new Error(`MongoDB: Error fetching users - ${error}`);
  }

  try {
    await Promise.all(
      users.map(async (user) => {
        const enteredGames = user.enteredGames.filter(
          (enteredGame) =>
            moment(enteredGame.time).format() !== moment(startingTime).format()
        );
        await db.user.saveEnteredGames(enteredGames, user.username);
      })
    );
  } catch (error) {
    throw new Error(`Error removing old entered games: ${error}`);
  }
};
