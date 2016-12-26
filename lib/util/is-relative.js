'use strict';

const path = require('path');


module.exports = function(a, b) {

  const res = path.relative(a, b);
  return res.indexOf('..') === 0 || a === b;

}
