const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const expressJWT = require('express-jwt');

const config = require('../config');

const logger = require('./utils/logger').logger;
const stream = require('./utils/logger').stream;

const db = require('./mongodb');
const munkres = require('./utils/munkres');

const COMPRESSED = ['/client.bundle'];

// TODO: Should be promise
db.connectToDb();

munkres.runMunkres();

const allowCORS = require('./middleware/cors');
const apiRoutes = require('./apiRoutes');

const app = express();

// Request gzip file if should be compressed
app.get('*.js', (req, res, next) => {
  COMPRESSED.forEach((value, index) => {
    if (req.url.startsWith(value[index])) {
      req.url += '.gz';
      res.set('Content-Encoding', 'gzip');
    }
  }, this);
  next();
});

const developmentEnv = config.env === 'development';
logger.info(`Node environment: ${config.env}`);

// Set logger
logger.info("Express: Overriding 'Express' logger");
app.use(require('morgan')('dev', { stream }));

// Parse body and populate req.body - only accepts JSON
app.use(bodyParser.json({ limit: '100kb' }));

app.use(
  expressJWT({ secret: config.jwtSecretKey }).unless({
    path: [
      /*
      { url: '/', methods: ['GET'] },
      { url: '/signup', methods: ['GET'] },
      { url: '/games', methods: ['GET'] },
      { url: '/login', methods: ['GET'] },
      { url: '/registration', methods: ['GET'] },
      { url: '/mygames', methods: ['GET'] },
      { url: '/admin', methods: ['GET'] },
      */
      // Allow all paths not starting with "/api"
      { url: /^(?!\/api).*$/i, methods: ['GET'] },
      { url: '/api/login', methods: ['POST', 'OPTIONS'] },
      { url: '/api/user', methods: ['POST', 'OPTIONS'] },
      { url: '/api/games', methods: ['GET', 'OPTIONS'] },
    ],
    ext: ['.js', '.css', '.html'],
  })
);

if (developmentEnv) {
  // logger.info('Express: Enable CORS in dev mode');
  app.use(allowCORS);
}

app.use('/api', apiRoutes);

// Set static path
const staticPath = path.join(__dirname, '../', 'front');
app.use(express.static(staticPath));

// No match, route to index
app.get('/*', (req, res) => {
  res.redirect('/');
});

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
  logger.info(`Express: Server started on port ${server.address().port}`);
});

module.exports = app;
