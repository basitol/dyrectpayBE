const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      //   winston.info('Connected to MongoDB Test...');
      console.log('Connected to MongoDB Test...');
    })
    .catch(err => {
      //   winston.error('Could not connect to MongoDB Test...', err);
      console.log('Could not connect to MongoDB Test...', err);
    });
};
