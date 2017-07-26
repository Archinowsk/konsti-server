const logger = require('../utils/logger').logger;
const db = require('../mongodb');
const assignPlayers = require('../utils/munkres').assignPlayers;
const validateAuthHeader = require('../utils/authHeader');

const storeMultiple = signupData =>
  (function loop(i) {
    return new Promise(resolve =>
      db.storeSignupResultData(signupData[i - 1]).then(() => resolve())
    ).then(() => i >= signupData.length || loop(i + 1));
  })(1);

// Assign players to games
const postPlayers = (req, res) => {
  logger.info('API call: POST /api/players');
  const startingTime = req.body.startingTime;

  const authHeader = req.headers.authorization;
  const validToken = validateAuthHeader(authHeader, 'admin');

  if (!validToken) {
    res.json({
      code: 31,
      message: 'Unauthorized',
      status: 'error',
    });
    return undefined;
  }

  return db.getUsersData().then(
    users => {
      db.getGamesData().then(
        games => {
          assignPlayers(users, games, startingTime).then(
            assignResults => {
              storeMultiple(assignResults).then(
                () => {
                  res.json({
                    message: 'Players assign success',
                    status: 'success',
                    results: assignResults,
                  });
                },
                error => {
                  logger.error(`Players: ${error}`);
                  res.json({
                    message: 'Players assign failure',
                    status: 'error',
                    error,
                  });
                }
              );
            },
            error => {
              logger.error(`Players: ${error}`);
              res.json({
                message: 'Players assign failure',
                status: 'error',
                error,
              });
            }
          );
        },
        error => {
          logger.error(`Players: ${error}`);
          res.json({
            message: 'Players assign failure',
            status: 'error',
            error,
          });
        }
      );
    },
    error => {
      logger.error(`Players: ${error}`);
      res.json({
        message: 'Players assign failure',
        status: 'error',
        error,
      });
    }
  );
};

module.exports = { postPlayers };
