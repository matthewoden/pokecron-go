const Datastore = require('nedb');
const path = require('path');

module.exports = function(config) {
  const storeOptions = config.memoryOnly ? null : { filename: config.datastore, autoload: true }
  const db = new Datastore(storeOptions);
  db.persistence.setAutocompactionInterval(30*60*1000)
  return db
}
