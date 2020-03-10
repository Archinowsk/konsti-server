import { validationResult } from 'express-validator';
import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import { hashPassword } from 'utils/bcrypt';
import { validateAuthHeader } from 'utils/authHeader';
import { Request, Response } from 'express';

const postUser = async (req: Request, res: Response): Promise<unknown> => {
  logger.info('API call: POST /api/user');
  const { username, password, serial, changePassword } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (changePassword) {
    try {
      const passwordHash = await hashPassword(password);
      db.user.updateUserPassword(username, passwordHash);
    } catch (error) {
      logger.error(`db.user.updateUser error: ${error}`);
      return res.json({
        message: 'Password change error',
        status: 'error',
      });
    }
    return res.json({
      message: 'Password changed',
      status: 'success',
    });
  }

  let serialFound = false;
  try {
    serialFound = await db.serial.findSerial(serial);
  } catch (error) {
    logger.error(`Error finding serial: ${error}`);
    return res.json({
      code: 10,
      message: 'Finding serial failed',
      status: 'error',
    });
  }

  // Check for valid serial
  if (!serialFound) {
    logger.info('User: Serial is not valid');
    return res.json({
      code: 12,
      message: 'Invalid serial',
      status: 'error',
    });
  }

  logger.info('User: Serial is valid');

  // Check that serial is not used
  let user = null;
  try {
    // Check if user already exists
    user = await db.user.findUser(username);
  } catch (error) {
    logger.error(`db.user.findUser(): ${error}`);
    return res.json({
      code: 10,
      message: 'Finding user failed',
      status: 'error',
    });
  }

  if (user) {
    logger.info(`User: Username "${username}" is already registered`);
    return res.json({
      code: 11,
      message: 'Username in already registered',
      status: 'error',
    });
  }

  // Username free
  if (!user) {
    // Check if serial is used
    let serialResponse = null;
    try {
      // @ts-ignore
      serialResponse = await db.user.findSerial({ serial });
    } catch (error) {
      logger.error(`db.user.findSerial(): ${error}`);
      return res.json({
        code: 10,
        message: 'Finding serial failed',
        status: 'error',
      });
    }

    // Serial used
    if (serialResponse) {
      logger.info('User: Serial used');
      return res.json({
        code: 12,
        message: 'Invalid serial',
        status: 'error',
      });
    }

    // Serial not used
    if (!serialResponse) {
      let passwordHash = null;
      try {
        passwordHash = await hashPassword(password);
      } catch (error) {
        logger.error(`hashPassword(): ${error}`);
        return res.json({
          code: 10,
          message: 'Hashing password failed',
          status: 'error',
        });
      }

      if (!passwordHash) {
        logger.info('User: Serial used');
        return res.json({
          code: 12,
          message: 'Invalid serial',
          status: 'error',
        });
      }

      if (passwordHash) {
        let saveUserResponse = null;
        try {
          saveUserResponse = await db.user.saveUser({
            username,
            passwordHash,
            serial,
          });
        } catch (error) {
          logger.error(`db.user.saveUser(): ${error}`);
          return res.json({
            code: 10,
            message: 'User registration failed',
            status: 'error',
          });
        }

        return res.json({
          message: 'User registration success',
          status: 'success',
          // @ts-ignore
          username: saveUserResponse.username,
          // @ts-ignore
          password: saveUserResponse.password,
        });
      }
    }
  }
};

// Get user info
const getUser = async (req: Request, res: Response): Promise<unknown> => {
  logger.info('API call: GET /api/user');
  const { username, serial } = req.query;

  const authHeader = req.headers.authorization;
  // @ts-ignore
  const validToken = validateAuthHeader(authHeader, 'user');

  if (!validToken) {
    return res.sendStatus(401);
  }

  let user = null;

  if (username) {
    try {
      user = await db.user.findUser(username);
    } catch (error) {
      logger.error(`db.user.findUser(): ${error}`);
      return res.json({
        message: 'Getting user data failed',
        status: 'error',
        error,
      });
    }
  }

  if (serial) {
    try {
      // @ts-ignore
      user = await db.user.findUserBySerial(serial);
    } catch (error) {
      logger.error(`db.user.findUser(): ${error}`);
      return res.json({
        message: 'Getting user data failed',
        status: 'error',
        error,
      });
    }
  }

  if (!user) {
    return res.json({
      message: `User ${username} not found`,
      status: 'error',
    });
  }

  return res.json({
    message: 'Getting user data success',
    status: 'success',
    games: {
      // @ts-ignore
      enteredGames: user.enteredGames,
      // @ts-ignore
      favoritedGames: user.favoritedGames,
      // @ts-ignore
      signedGames: user.signedGames,
    },
    // @ts-ignore
    username: user.username,
    // @ts-ignore
    serial: user.serial,
  });
};

export { postUser, getUser };
