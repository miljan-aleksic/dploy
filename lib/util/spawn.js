'use strict';

const {spawn} = require('child_process');
const Promise = require('bluebird');


module.exports = function() {

  const args = Array.prototype.slice.call(arguments);
  const cmd = args[0];

  return new Promise((resolve, reject) => {

    let data = '';
    const run = spawn(cmd, args.slice(1));

    run.on('close', () => {

      resolve(data.toString().replace(/(^\s*\n)|(\s*\n$)/g, ''));

    });

    run.on('error', (err) => reject(err.toString()));

    run.stdout.on('data', (buffer) => data += buffer);

    run.stderr.on('data', (buffer) => reject(buffer.toString()));

  });

}
