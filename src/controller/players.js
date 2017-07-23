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

      // db.signupResultData(signupResultData);

      res.json({
        message: 'Players assign success',
        status: 'success',
        client_data: req.body,
        response,
      });
    },
    error => {
      res.json({
        message: 'layers assign failure',
        status: 'error',
        client_data: req.body,
        error,
      });
    }
  );
};

module.exports = { postPlayers };
