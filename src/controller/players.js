const logger = require('../utils/logger').logger;
const db = require('../mongodb');
const assignPlayers = require('../utils/munkres').assignPlayers;

// Assign players to games
const postPlayers = (req, res) => {
  logger.info('API call: POST /api/players');
  const startingTime = req.body.startingTime;

  db.getUsersData().then(
    response => {
      db.getGamesData().then(
        response2 => {
          // Execute sorting algorithm for users with valid signups
          // Store results to user profile

          // TODO: Assign
          assignPlayers(response, response2, startingTime).then(
            response3 => {
              db.storeSignupResultData(response3[2]).then(
                response4 => {
                  res.json({
                    message: 'Players assign success',
                    status: 'success',
                    response3,
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
