const logger = require('../utils/logger').logger;
const db = require('../mongodb');

// Add signup data for user
const postSignup = (req, res) => {
  logger.info('API call: POST /api/signup');
  const signupData = req.body.signupData;

  db.storeSignupData(signupData).then(
    response => {
      res.json({
        message: 'Signup success',
        status: 'success',
        client_data: req.body,
        response,
      });
    },
    error => {
      res.json({
        message: 'Signup failure',
        status: 'error',
        client_data: req.body,
        error,
      });
    }
  );
};

module.exports = { postSignup };
