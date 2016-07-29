
const { promisify } = require('../util')

const toInt = (string) => parseInt(string.N, 10)
const toFloat = (string) => parseFloat(string.N, 10)


const createBatchDeleteObject = (items) => items.map(item => (
  {
     DeleteRequest: {
       Key: {
          encounter_id: { 'N': item.encounter_id.toString() },
          id: { 'N': item.id.toString() },
      }
    }
  }))

const createBatchAddObject = (items) => items.map(item => (
  {
    PutRequest: {
        Item: {
          encounter_id: { 'N': item.encounter_id.toString() },
          id: { 'N': item.id.toString() },
          latitude: {'N': item.latitude.toString() },
          longitude: {'N' : item.longitude.toString() },
          expires: {'N' : item.expires.toString() },
          expiresString: { 'S' : item.expiresString.toString() },
          name: { 'S' : item.name },
          directions: { 'S' : item.directions }
        }
      }
  }))

const createBatchWriteObject = (additions, deletions, table) => {
  const put = createBatchAddObject(additions)
  const del = createBatchDeleteObject(deletions)
  return { RequestItems: { [table]: [].concat(del).concat(put) } }
}

const toObject = (item) => ({
    encounter_id: toInt(item.encounter_id),
    id: toInt(item.id),
    latitude: toFloat(item.latitude),
    longitude: toFloat(item.longitude),
    expires: toFloat(item.expires),
    expiresString: item.expiresString.S,
    name: item.name.S,
    directions: item.directions.S
  })


module.exports = function (config) {
  const db = require('./dynamoInstance.js')(config)
  const scan = db.scan.bind(db)
  const batchWrite = db.batchWriteItem.bind(db)

  const getCurrent = () =>
    promisify(scan)({ 'TableName': config.table })
      .then(({Items}) => Items.map(toObject))

  const update = (additions, deletions) => {
    if (additions.length > 0 || deletions.length > 0) {
      promisify(batchWrite)(createBatchWriteObject(additions, deletions, config.table))
    } else {
      return 'no updates needed';
    }
  }


  return { getCurrent, update }
}
