const Datastore = require('nedb');
const path = require('path');


module.exports = function(config) {
  const storeOptions = config.memoryOnly ? {} : { filename: config.datastore, autoload: true }
  const db = new Datastore(storeOptions);
  db.persistence.setAutocompactionInterval(5*60*1000)
  return db
}
