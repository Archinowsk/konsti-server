const { checkSerial } = require('../utils/serials');
const logger = require('../utils/logger').logger;
const db = require('../mongodb');
const hashPassword = require('../utils/bcrypt').hashPassword;
const validateAuthHeader = require('../utils/authHeader');

// Register new user
const postUser = (req, res) => {
  logger.info('API call: POST /api/user');
  const registrationData = req.body.registrationData;

  // Validate values
  if (
    !registrationData ||
    !registrationData.username ||
    !registrationData.password ||
    !registrationData.serial
  ) {
    logger.info('User: validation failed');
    res.json({
      message: 'Validation error',
      status: 'error',
    });
    // Check for valid serial
  } else if (!checkSerial(registrationData.serial.trim())) {
    logger.info('User: Serial does not match');
    res.json({
      code: 12,
      message: 'Invalid serial',
      status: 'error',
    });
    // Check that serial is not used
  } else {
    /*
  else if (true) {
    // asd
  }
  */
    logger.info('User: Serial match');

    const username = registrationData.username.trim();
    const password = registrationData.password.trim();
    const serial = registrationData.serial.trim();

    logger.info(registrationData);
    // Check if user already exists
    db.getUserData({ username }).then(
      response => {
        // Username free
        if (response.length === 0) {
          // Check if serial is used
          db.getUserSerial({ serial }).then(
            serialResponse => {
              // Serial not used
              if (serialResponse.length === 0) {
                hashPassword(password).then(
                  response2 => {
                    registrationData.passwordHash = response2;

                    db.storeUserData(registrationData).then(
                      () => {
                        res.json({
                          message: 'User registration success',
                          status: 'success',
                          // data: response3,
                        });
                      },
                      error => {
                        logger.error(`User: ${error}`);
                        res.json({
                          message: 'User registration failed',
                          status: 'error',
                        });
                      }
                    );
                  },
                  error => {
                    logger.error(`User: ${error}`);
                  }
                );
              } else {
                logger.info('User: Serial used');
                res.json({
                  code: 12,
                  message: 'Invalid serial',
                  status: 'error',
                });
              }
            },
            error => {}
          );
        } else {
          logger.info(`User: Username "${username}" is already registered`);
          res.json({
            code: 11,
            message: 'Username in already registered',
            status: 'error',
            // response,
          });
        }
      },
      error => {
        logger.error(`User: ${error}`);
      }
    );
  }
};

// Get user info
const getUser = (req, res) => {
  logger.info('API call: GET /api/user');
  const username = req.query.username;

  const authHeader = req.headers.authorization;
  const validToken = validateAuthHeader(authHeader, 'user');

  if (!validToken) {
    res.json({
      code: 31,
      message: 'Unauthorized',
      status: 'error',
    });
    return undefined;
  }

  return db.getUserData({ username }).then(
    response => {
      const returnData = {
        enteredGames: response[0].entered_games,
        favoritedGames: response[0].favorited_games,
        signedGames: response[0].signed_games,
      };

      res.json({
        message: 'Getting user data success',
        status: 'success',
        games: returnData,
      });
    },
    error => {
      logger.error(`User: ${error}`);
      res.json({
        message: 'Getting user data failed',
        status: 'error',
        error,
      });
    }
  );
};

module.exports = { postUser, getUser };
