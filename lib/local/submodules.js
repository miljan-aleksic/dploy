'use strict';

const Promise = require('bluebird');
const each = require('lodash.foreach');
const spawn = require('../util/spawn');

module.exports = {

  parse(submodules) {

    const actions = [];

    each(submodules, (dest, sub) => {

      actions.push(() => {

        return spawn('git', '-C', sub, 'rev-parse', 'HEAD').then((hash) => {

          let obj = {};
          obj[sub] = { hash, dest };
          return obj;

        });

      });

    });

    return Promise.reduce(actions, (values, action) => {

      return action().then((value) => {

        values.push(value);
        return values;

      });

    }, []);

  }

};
