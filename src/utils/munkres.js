const munkres = require('munkres-js');
const logger = require('./logger').logger;

const runMunkres = () => {
  const result = munkres([[400, 150, 400], [400, 450, 600], [300, 225, 300]]);
  // => [ [ 0, 1 ], [ 1, 0 ], [ 2, 2 ] ]
  // logger.info(result);
};

module.exports = { runMunkres };
