'use strict';

const args = require('./lib/args')
const Promise = require('bluebird')
const logger = require('./lib/logger')
const config = require('./lib/config')
const deploy = require('./lib/deploy')

const dploy = {

  init(settings) {

    let envs = settings ? [settings] : config(args);

    if (!settings) {

      logger.level = args.debug ? 2 : 1;
      logger.level = args.silent ? 0 : logger.level;

    }

    Promise.reduce(envs.map((value) => dploy.start(value)), (_, action) => {

      return action();

    }, null).then(logger.writeLog);

  },

  start(settings) {

    return () => deploy(settings);

  }
};

module.exports = dploy.init;
