'use strict';

const path = require('path');
const chalk = require('chalk');
const files = require('map-files');
const Promise = require('bluebird');
const logger = require('../logger');
const each = require('lodash.foreach');


module.exports = function(settings) {

  const hasInclude = Object.keys(settings.include).length > 0;
  const upload = [];

  if (!hasInclude || !settings.includeFiles || settings.catchup) {

    return Promise.resolve(settings);

  }

  logger.spaced(1, chalk.yellow('Including files...'));

  each(settings.include, (value, key) => {

    const newFiles = files(key, { read: (filepath) => {

      return path.relative('', filepath);

    }});

    each(newFiles, (filepath) => {

      upload.push({
        local: filepath,
        remote: path.join(value, path.basename(filepath)),
        included: true
      });

    });

  });

  logger.spaced(3, chalk.green(`[included ${upload.length} files]`));

  settings.queue.upload = settings.queue.upload.concat(upload);

  return Promise.resolve(settings);

}
