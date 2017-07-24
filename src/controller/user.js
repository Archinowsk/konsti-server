const { checkSerial } = require('../utils/serials');
const logger = require('../utils/logger').logger;
const db = require('../mongodb');
const hashPassword = require('../utils/bcrypt').hashPassword;

// Register new user
const postUser = (req, res) => {
  logger.info('API call: POST /api/user');
  const registrationData = req.body.registrationData;

  if (checkSerial(registrationData.serial)) {
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
                    client_data: req.body,
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
            client_data: req.body,
            response,
          });
        }
      },
      error => {
        logger.error(`User: ${error}`);
      }
    );
  } else {
    logger.info('User: Serial does not match');
    res.json({
      code: 12,
      message: 'Invalid serial',
      status: 'error',
      client_data: req.body,
    });
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
        client_data: req.body,
      });
    },
    error => {
      logger.error(`User: ${error}`);
      res.json({
        message: 'Getting user data failed',
        status: 'error',
        error,
        client_data: req.body,
      });
    }
  );
};

module.exports = { postUser, getUser };
