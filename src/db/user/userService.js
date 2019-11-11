// @flow
import to from 'await-to-js';
import moment from 'moment';
import { logger } from 'utils/logger';
import { User } from 'db/user/userSchema';
import type { Result, Signup } from 'flow/result.flow';
import type { NewUserData, SignedGame } from 'flow/user.flow';

const removeUsers = () => {
  logger.info('MongoDB: remove ALL users from db');
  return User.deleteMany({});
};

const saveUser = async (newUserData: NewUserData): Promise<any> => {
  const user = new User({
    username: newUserData.username,
    password: newUserData.passwordHash,
    userGroup:
      typeof newUserData.userGroup === 'string'
        ? newUserData.userGroup
        : 'user', // Options: 'user' and 'admin'
    serial: newUserData.serial,
    groupCode:
      typeof newUserData.groupCode === 'string' ? newUserData.groupCode : '0',
    favoritedGames: newUserData.favoritedGames || [],
    signedGames: newUserData.signedGames || [],
    enteredGames: newUserData.enteredGames || [],
  });

  let response = null;
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
  let response = null;

  try {
    response = await User.findOneAndUpdate(
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
        favoritedGames: newUserData.favoritedGames || [],
        signedGames: newUserData.signedGames || [],
        enteredGames: newUserData.enteredGames || [],
      },
      { new: true, fields: '-_id -__v -createdAt -updatedAt' }
    )
      .lean()
      .populate('favoritedGames')
      .populate('enteredGames.gameDetails')
      .populate('signedGames.gameDetails');

    logger.debug(`MongoDB: User "${newUserData.username}" updated`);

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
  let response = null;

  try {
    response = await User.findOneAndUpdate(
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

    return response;
  } catch (error) {
    logger.error(
      `MongoDB: Error updating password for user ${username} - ${error}`
    );
    return error;
  }
};

const findUser = async (username: string): Promise<any> => {
  let response = null;
  try {
    response = await User.findOne(
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
  let response = null;
  try {
    response = await User.findOne(
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
  return response;
};

const findSerial = async (serialData: Object): Promise<void> => {
  const serial = serialData.serial;

  let response = null;
  try {
    response = await User.findOne({ serial }).lean();
  } catch (error) {
    logger.error(`MongoDB: Error finding Serial ${serial} - ${error}`);
    return error;
  }

  if (!response) {
    logger.info(`MongoDB: Serial "${serial}" not found`);
  } else {
    logger.debug(`MongoDB: Found Serial "${serial}"`);
  }
  return response;
};

const findGroupMembers = async (groupCode: string): Promise<any> => {
  let response = null;
  try {
    response = await User.find({ groupCode })
      .lean()
      .populate('favoritedGames')
      .populate('enteredGames.gameDetails')
      .populate('signedGames.gameDetails');
  } catch (error) {
    logger.error(`MongoDB: Error finding group ${groupCode} - ${error}`);
    return error;
  }

  if (!response || response.length === 0) {
    logger.info(`MongoDB: group "${groupCode}" not found`);
  } else {
    logger.debug(
      `MongoDB: Found group "${groupCode}" with ${response.length} members`
    );
  }
  return response;
};

const findGroup = async (
  groupCode: string,
  username: string
): Promise<void> => {
  let response = null;
  if (username) {
    try {
      response = await User.findOne({ groupCode, username }).lean();
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
    return response;
  } else {
    try {
      response = await User.findOne(groupCode).lean();
    } catch (error) {
      logger.error(`MongoDB: Error finding group ${groupCode} - ${error}`);
      return error;
    }

    if (!response) {
      logger.info(`MongoDB: Group "${groupCode}" not found`);
    } else {
      logger.info(`MongoDB: Group "${groupCode}" found`);
    }
    return response;
  }
};

const findUsers = async (): Promise<any> => {
  logger.debug(`MongoDB: Find all users`);

  const [error, users] = await to(
    User.find({})
      .lean()
      .populate('favoritedGames')
      .populate('enteredGames.gameDetails')
      .populate('signedGames.gameDetails')
  );
  if (error) throw new Error(`MongoDB: Error fetcing users - ${error}`);
  if (!users) throw new Error('MongoDB: No users found');

  return users;
};

const saveSignup = async (signupData: Signup): Promise<any> => {
  const { signedGames, username } = signupData;

  let signupResponse = null;
  try {
    signupResponse = await User.findOneAndUpdate(
      { username: username },
      {
        signedGames: signedGames.map(signedGame => {
          return {
            gameDetails: signedGame.gameDetails._id,
            priority: signedGame.priority,
            time: signedGame.time,
          };
        }),
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
  let response = null;

  try {
    response = await User.findOneAndUpdate(
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
  return response;
};

const saveFavorite = async (favoriteData: Object): Promise<any> => {
  let response = null;
  try {
    response = await User.findOneAndUpdate(
      { username: favoriteData.username },
      {
        favoritedGames: favoriteData.favoritedGames.map(game => {
          return game._id;
        }),
      },
      { new: true, fields: 'favoritedGames' }
    )
      .lean()
      .populate('favoritedGames');

    logger.info(
      `MongoDB: Favorite data stored for user "${favoriteData.username}"`
    );
    return response;
  } catch (error) {
    logger.error(
      `MongoDB: Error storing favorite data for user "${favoriteData.username}" - ${error}`
    );
    return error;
  }
};

const getEnteredGames = async (
  signupResult: Result
): Promise<$ReadOnlyArray<SignedGame>> => {
  const user = await findUser(signupResult.username);

  if (user.enteredGames.length === 0) {
    return [signupResult.enteredGame];
  }

  // Remove results for same time
  const enteredGames = user.enteredGames.filter(enteredGame => {
    return (
      moment(enteredGame.time).format() !==
      moment(signupResult.enteredGame.time).format()
    );
  });

  return enteredGames.concat([signupResult.enteredGame]);
};

const saveSignupResult = async (signupResult: Result): Promise<void> => {
  const newEnteredGames = await getEnteredGames(signupResult);

  let response = null;
  try {
    response = await User.updateOne(
      {
        username: signupResult.username,
      },
      {
        enteredGames: newEnteredGames,
      }
    );

    logger.debug(
      `MongoDB: Signup result data stored for user "${signupResult.username}"`
    );
    return response;
  } catch (error) {
    logger.error(
      `MongoDB: Error storing signup result data for user ${signupResult.username} - ${error}`
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
};
