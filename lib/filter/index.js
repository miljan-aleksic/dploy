'use strict';

const map = require('./map');
const include = require('./include');
const exclude = require('./exclude');
const duplicated = require('./duplicated');


module.exports = function(settings) {

  return map(settings).then(include).then(exclude).then(duplicated);

}
