'use strict';

const path = require('path');
const chalk = require('chalk');
const mm = require('micromatch');
const files = require('map-files');
const Promise = require('bluebird');
const logger = require('../logger');
const each = require('lodash.foreach');


module.exports = function(settings) {

  if (!Object.keys(settings.map).length || settings.catchup) {

    return Promise.resolve(settings);

  }

  const upload = [];

  logger.spaced(1, chalk.yellow('Mapping files...'));

  each(settings.map, (value, key) => {

    settings.queue.upload.forEach((file) => {

      if (mm.isMatch(file.local, key)) {

        const newFiles = files(value, { read: (filepath) => {

          return path.relative('', filepath);

        }});

        each(newFiles, (filepath) => {

          if (upload.indexOf(filepath) < 0) {

            upload.push(filepath);

          }

        });

      }

    });

  });

  logger.spaced(3, chalk.green(`[mapped ${upload.length} files]`));

  upload.forEach((item) => {

    settings.queue.upload.push({
      local: item,
      remote: item.replace(settings.path.local, ''),
      mapped: true
    });

  });

  return Promise.resolve(settings);

}
