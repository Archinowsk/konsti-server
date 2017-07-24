const logger = require('../utils/logger').logger;
const db = require('../mongodb');
const comparePasswordHash = require('../utils/bcrypt').comparePasswordHash;

const validateLogin = (loginData, hash) =>
  comparePasswordHash(loginData.password, hash).then(response => {
    // Password matches hash
    if (response === true) {
      // logger.info(`Login: User "${loginData.username}" password match`);
      return true;
    }
    // logger.info(`Login: User "${loginData.username}" password doesn't match`);
    return false;
  }, error => error);

function postLogin(req, res) {
  logger.info('API call: POST /api/login');
  const loginData = req.body.loginData;

  db.getUserData(loginData).then(
    response => {
      // User exists
      if (response.length > 0) {
        // logger.info(`User "${loginData.username}" found`);
        return validateLogin(loginData, response[0].password).then(
          response2 => {
            if (response2 === true) {
              logger.info(
                `Login: Password for user "${loginData.username}" matches`
              );
              res.json({
                message: 'User login success',
                status: 'success',
                response: response2,
                client_data: loginData,
              });
            } else {
              logger.info(
                `Login: Password for user "${loginData.username}" doesn't match`
              );

              res.json({
                code: 21,
                message: 'User login failed',
                status: 'error',
                response: response2,
                client_data: loginData,
              });
            }
          },
          error => {
            logger.error(`Login: ${error}`);
            res.json({
              message: 'User login error',
              status: 'error',
              error,
            });
          }
        );
      }
      logger.info(`Login: User "${loginData.username}" not found`);
      res.json({
        message: 'User login error',
        status: 'error',
      });
      return undefined;
    },
    error => {
      logger.error(`Login: ${error}`);
      res.json({
        message: 'User login error',
        status: 'error',
        error,
      });
    }
  );
}

module.exports = { postLogin };
