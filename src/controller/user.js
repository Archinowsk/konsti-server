const { checkSerial } = require('../utils/serials');
const logger = require('../utils/logger').logger;
const db = require('../mongodb');
const hashPassword = require('../utils/bcrypt').hashPassword;

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
  } else if (!checkSerial(registrationData.serial)) {
    logger.info('User: Serial does not match');
    res.json({
      code: 12,
      message: 'Invalid serial',
      status: 'error',
    });
  } else {
    logger.info('User: Serial match');
    // Check if user already exists
    db.getUserData({ username: registrationData.username }).then(
      response => {
        if (response.length === 0) {
          hashPassword(registrationData.password).then(
            response2 => {
              registrationData.passwordHash = response2;

              db.storeUserData(registrationData).then(
                response3 => {
                  res.json({
                    message: 'User registration success',
                    status: 'success',
                    data: response3,
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
          logger.info(
            `User: Username "${registrationData.username}" is already registered`
          );
          res.json({
            code: 11,
            message: 'Username in already registered',
            status: 'error',
            response,
          });
        }
      },
      error => {
        logger.error(`User: ${error}`);
      }
    );
  }
};

const getUser = (req, res) => {
  logger.info('API call: GET /api/user');
  const username = req.query.username;

  db.getUserData({ username }).then(
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
