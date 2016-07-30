const PushBullet = require('pushbullet')

module.exports = function(token) {
  const pb = new PushBullet(token);
  return pb;
}
