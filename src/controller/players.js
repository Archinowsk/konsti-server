const logger = require('../utils/logger').logger;
const db = require('../mongodb');

// Assign players to games
const postPlayers = (req, res) => {
  logger.info('API call: POST /api/game');
  // const formData = req.body.formData;

  db.getUsersData().then(
    response => {
      // Execute sorting algorithm for users with valid signups
      // Store results to user profile

      // TODO: Assign
      // db.signupResultData(signupResultData);

      res.json({
        message: 'Players assign success',
        status: 'success',
        response,
      });
    },
    error => {
      res.json({
        message: 'layers assign failure',
        status: 'error',
        error,
      });
    }
  );
};

module.exports = { postPlayers };
