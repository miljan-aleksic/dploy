'use strict';


module.exports = function(value, trim = '\s') {

  const reg = new RegExp(`^${trim}`);
  return value.replace(reg, '');

}
