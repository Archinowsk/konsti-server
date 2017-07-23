const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

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
const requireAuthHeader = require('./middleware/authHeader');
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

if (developmentEnv) {
  app.use(allowCORS);
}

app.use('/api', requireAuthHeader, apiRoutes);

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
