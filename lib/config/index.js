'use strict';

const yaml = require('yamljs');
const chalk = require('chalk');
const files = require('map-files');
const logger = require('../logger');
const merge = require('lodash.merge');
const each = require('lodash.forEach');


let file;

const DEFAULTS = {
  diff: 'git',
  scheme: 'ftp',
  port: null,
  revision: '.rev',
  confirm: true,
  path: {
    local: '',
    remote: './'
  },
  options: {},
  exclude: [],
  include: {},
  map: {},
  submodules: false,
  hash: { local: null, remote: null },
  submodulesHash: { local: {}, remote: {} },
  queue: { upload: [], delete: [] },
  createdFolders: []
};

function getTarget(target) {

  if (!file) {

    const configs = files('dploy.{yaml,yml,json}', { cwd: process.cwd() });

    logger.debug('Looking for a dploy config file...');

    if (configs.hasOwnProperty('dploy')) {

      try {

        file = yaml.parse(configs.dploy.content);
        logger.debug(`Found ${chalk.white('dploy.yaml')}.`);

      } catch (e) {

        file = JSON.parse(configs.dploy.content);
        logger.debug(`Found ${chalk.white('dploy.json')}`);

      }

    } else {

      throw new Error(`The dploy config file was not found.`);

    }

  }

  if (file.hasOwnProperty(target)) {

    logger.debug(`Parsing config for ${chalk.white(target)}`);
    file[target].target = target;
    return file[target];

  }

  throw new Error(`The target "${target}" could not be found on your config.`);

}


module.exports = function(args) {

  const configs = [];
  const deleteKeys = ['include-files', 'i', 'h', 'help', 'v', 'version', 'c'];

  each(deleteKeys, (key) => delete args[key]);

  each(args._, (target) => {

    configs.push(merge({}, DEFAULTS, getTarget(target), args));

  });

  return configs;

}
