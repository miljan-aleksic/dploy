'use strict';

const Promise = require('bluebird');


module.exports = function(res) {

  return new Promise((resolve, reject) => {

    if (typeof res === 'string') {

      resolve(res);

    } else {

      let data = '';

      res.on('data', (chunk) => data += chunk.toString());

      res.on('end', () => resolve(data));

      res.on('error', (err) => reject(err));

    }

  });

}
