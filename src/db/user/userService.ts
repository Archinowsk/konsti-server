import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import { UserModel } from 'db/user/userSchema';
import { Result, Signup } from 'typings/result.typings';
import { NewUserData, EnteredGame, SignedGame } from 'typings/user.typings';

const removeUsers = async (): Promise<void> => {
  logger.info('MongoDB: remove ALL users from db');
  try {
    await UserModel.deleteMany({});
  } catch (error) {
    throw new Error(`MongoDB: Error removing users: ${error}`);
  }
};

const saveUser = async (newUserData: NewUserData): Promise<any> => {
  const user = new UserModel({
    username: newUserData.username,
    password: newUserData.passwordHash,
    userGroup:
      typeof newUserData.userGroup === 'string'
        ? newUserData.userGroup
        : 'user', // Options: 'user' and 'admin'
    serial: newUserData.serial,
    groupCode:
      typeof newUserData.groupCode === 'string' ? newUserData.groupCode : '0',
    favoritedGames: newUserData.favoritedGames ?? [],
    signedGames: newUserData.signedGames ?? [],
    enteredGames: newUserData.enteredGames ?? [],
  });

  let response;
  try {
    response = await user.save();
    logger.debug(`MongoDB: User "${newUserData.username}" saved to DB`);
    return response;
  } catch (error) {
    logger.error(
      `MongoDB: Error creating new user ${newUserData.username} - ${error}`
    );
    return error;
  }
};

const updateUser = async (newUserData: NewUserData): Promise<void> => {
  let response;

  try {
    response = await UserModel.findOneAndUpdate(
      { username: newUserData.username },
      {
        // username: newUserData.username,
        // password: newUserData.passwordHash,
        userGroup:
          typeof newUserData.userGroup === 'string'
            ? newUserData.userGroup
            : 'user', // Options: 'user' and 'admin'
        serial: newUserData.serial,
        groupCode:
          typeof newUserData.groupCode === 'string'
            ? newUserData.groupCode
            : '0',
        favoritedGames: newUserData.favoritedGames ?? [],
        signedGames: newUserData.signedGames ?? [],
        enteredGames: newUserData.enteredGames ?? [],
      },
      { new: true, fields: '-_id -__v -createdAt -updatedAt' }
    )
      .lean()
      .populate('favoritedGames')
      .populate('enteredGames.gameDetails')
      .populate('signedGames.gameDetails');

    logger.debug(`MongoDB: User "${newUserData.username}" updated`);

    // @ts-ignore
    return response;
  } catch (error) {
    logger.error(
      `MongoDB: Error updating user ${newUserData.username} - ${error}`
    );
    return error;
  }
};

const updateUserPassword = async (
  username: string,
  password: string
): Promise<void> => {
  let response;

  try {
    response = await UserModel.findOneAndUpdate(
      { username: username },
      {
        password: password,
      },
      { new: true, fields: '-_id -__v -createdAt -updatedAt' }
    )
      .lean()
      .populate('favoritedGames')
      .populate('enteredGames.gameDetails')
      .populate('signedGames.gameDetails');

    logger.debug(`MongoDB: Password for user "${username}" updated`);

    // @ts-ignore
    return response;
  } catch (error) {
    logger.error(
      `MongoDB: Error updating password for user ${username} - ${error}`
    );
    return error;
  }
};

const findUser = async (username: string): Promise<any> => {
  let response;
  try {
    response = await UserModel.findOne(
      { username },
      '-signedGames._id -enteredGames._id'
    )
      .lean()
      .populate('favoritedGames')
      .populate('enteredGames.gameDetails')
      .populate('signedGames.gameDetails');
  } catch (error) {
    logger.error(`MongoDB: Error finding user ${username} - ${error}`);
    return error;
  }

  if (!response) {
    logger.info(`MongoDB: User "${username}" not found`);
  } else {
    logger.debug(`MongoDB: Found user "${username}"`);
  }
  return response;
};

const findUserBySerial = async (serial: string): Promise<void> => {
  let response;
  try {
    response = await UserModel.findOne(
      { serial },
      '-signedGames._id -enteredGames._id'
    )
      .lean()
      .populate('favoritedGames')
      .populate('enteredGames.gameDetails')
      .populate('signedGames.gameDetails');
  } catch (error) {
    logger.error(
      `MongoDB: Error finding user with serial ${serial} - ${error}`
    );
    return error;
  }

  if (!response) {
    logger.info(`MongoDB: User with serial "${serial}" not found`);
  } else {
    logger.debug(`MongoDB: Found user with serial "${serial}"`);
  }
  // @ts-ignore
  return response;
};

const findSerial = async (serialData: Object): Promise<void> => {
  // @ts-ignore
  const serial = serialData.serial;

  let response;
  try {
    response = await UserModel.findOne({ serial }).lean();
  } catch (error) {
    logger.error(`MongoDB: Error finding Serial ${serial} - ${error}`);
    return error;
  }

  if (!response) {
    logger.info(`MongoDB: Serial "${serial}" not found`);
  } else {
    logger.debug(`MongoDB: Found Serial "${serial}"`);
  }
  // @ts-ignore
  return response;
};

const findGroupMembers = async (groupCode: string): Promise<any> => {
  let response;
  try {
    response = await UserModel.find({ groupCode })
      .lean()
      .populate('favoritedGames')
      .populate('enteredGames.gameDetails')
      .populate('signedGames.gameDetails');
  } catch (error) {
    logger.error(`MongoDB: Error finding group ${groupCode} - ${error}`);
    return error;
  }

  // @ts-ignore
  if (!response || response.length === 0) {
    logger.info(`MongoDB: group "${groupCode}" not found`);
  } else {
    logger.debug(
      // @ts-ignore
      `MongoDB: Found group "${groupCode}" with ${response.length} members`
    );
  }
  return response;
};

const findGroup = async (
  groupCode: string,
  username: string
): Promise<void> => {
  let response;
  if (username) {
    try {
      response = await UserModel.findOne({ groupCode, username }).lean();
    } catch (error) {
      logger.error(`MongoDB: Error finding group ${groupCode} - ${error}`);
      return error;
    }

    if (!response) {
      logger.info(
        `MongoDB: Group "${groupCode}" with leader "${username}" not found`
      );
    } else {
      logger.info(
        `MongoDB: Group "${groupCode}" with leader "${username}" found`
      );
    }
    // @ts-ignore
    return response;
  } else {
    try {
      response = await UserModel.findOne({ groupCode }).lean();
    } catch (error) {
      logger.error(`MongoDB: Error finding group ${groupCode} - ${error}`);
      return error;
    }

    if (!response) {
      logger.info(`MongoDB: Group "${groupCode}" not found`);
    } else {
      logger.info(`MongoDB: Group "${groupCode}" found`);
    }
    // @ts-ignore
    return response;
  }
};

const findUsers = async (): Promise<any> => {
  logger.debug(`MongoDB: Find all users`);
  let users;
  try {
    users = await UserModel.find({})
      .lean()
      .populate('favoritedGames')
      .populate('enteredGames.gameDetails')
      .populate('signedGames.gameDetails');
  } catch (error) {
    throw new Error(`MongoDB: Error fetching users - ${error}`);
  }
  return users;
};

const saveSignup = async (signupData: Signup): Promise<any> => {
  const { signedGames, username } = signupData;

  let games;
  try {
    games = await db.game.findGames();
  } catch (error) {
    logger.error(`MongoDB: Error loading games - ${error}`);
    return error;
  }

  const formattedData = signedGames.reduce((acc, signedGame) => {
    const gameDocInDb = games.find(
      (game) => game.gameId === signedGame.gameDetails.gameId
    );

    if (gameDocInDb) {
      acc.push({
        gameDetails: gameDocInDb._id,
        priority: signedGame.priority,
        time: signedGame.time,
      });
    }
    return acc;
  }, [] as SignedGame[]);

  let signupResponse;
  try {
    signupResponse = await UserModel.findOneAndUpdate(
      { username: username },
      {
        signedGames: formattedData,
      },
      { new: true, fields: '-signedGames._id' }
    ).populate('signedGames.gameDetails');
  } catch (error) {
    logger.error(
      `MongoDB: Error storing signup data for user "${username}" - ${error}`
    );
    return error;
  }

  logger.debug(`MongoDB: Signup data stored for user "${username}"`);
  return signupResponse;
};

const saveGroupCode = async (
  groupCode: string,
  username: string
): Promise<void> => {
  let response;

  try {
    response = await UserModel.findOneAndUpdate(
      { username: username },
      { groupCode: groupCode },
      { new: true, fields: 'groupCode' }
    );
  } catch (error) {
    logger.error(
      `MongoDB: Error storing group "${groupCode}" stored for user "${username}" - ${error}`
    );
    return error;
  }

  if (groupCode === '0') {
    logger.info(`MongoDB: User "${username}" left group`);
  } else {
    logger.info(`MongoDB: Group "${groupCode}" stored for user "${username}"`);
  }
  // @ts-ignore
  return response;
};

const saveFavorite = async (favoriteData: Object): Promise<any> => {
  let response;
  try {
    response = await UserModel.findOneAndUpdate(
      // @ts-ignore
      { username: favoriteData.username },
      {
        // @ts-ignore
        favoritedGames: favoriteData.favoritedGames.map((game) => {
          return game._id;
        }),
      },
      { new: true, fields: 'favoritedGames' }
    )
      .lean()
      .populate('favoritedGames');

    logger.info(
      // @ts-ignore
      `MongoDB: Favorite data stored for user "${favoriteData.username}"`
    );
    return response;
  } catch (error) {
    logger.error(
      // @ts-ignore
      `MongoDB: Error storing favorite data for user "${favoriteData.username}" - ${error}`
    );
    return error;
  }
};

const saveSignupResult = async (signupResult: Result): Promise<void> => {
  let response;
  try {
    response = await UserModel.updateOne(
      {
        username: signupResult.username,
      },
      {
        enteredGames: signupResult.enteredGame,
      }
    );

    logger.debug(
      `MongoDB: Signup result data stored for user "${signupResult.username}"`
    );
    // @ts-ignore
    return response;
  } catch (error) {
    logger.error(
      `MongoDB: Error storing signup result data for user ${signupResult.username} - ${error}`
    );
    return error;
  }
};

const saveEnteredGames = async (
  enteredGames: readonly EnteredGame[],
  username: string
): Promise<void> => {
  let response;
  try {
    response = await UserModel.updateOne(
      {
        username,
      },
      {
        enteredGames,
      }
    );

    logger.debug(
      `MongoDB: Updated entered games stored for user "${username}"`
    );
    // @ts-ignore
    return response;
  } catch (error) {
    logger.error(
      `MongoDB: Error updating entered games for user ${username} - ${error}`
    );
    return error;
  }
};

export const user = {
  findSerial,
  findUser,
  findGroup,
  findUsers,
  removeUsers,
  saveFavorite,
  saveSignup,
  saveSignupResult,
  saveUser,
  findGroupMembers,
  saveGroupCode,
  updateUser,
  findUserBySerial,
  updateUserPassword,
  saveEnteredGames,
};
