const AWS = require('aws-sdk')

const DB = new AWS.DynamoDB({
  accessKeyId: process.env.POKEMON_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.POKEMON_AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
  apiVersion: '2012-08-10'
});


const promisify = (fn, params) => {
  return new Promise((resolve, reject) => {
    const callback = (err, data) => err ? reject(err) : resolve(promise)
    return fn(params, callback)
  })
}



const createBatchDeleteObject = (items) => {
  const requests = items.map(item => {
    const request = {
            encounter_id: { 'N': item.encounter_id.toString() },
            id: { 'N': item.id.toString() },
          }

    return { DeleteRequest: { Key: request } }
  })
  return { RequestItems: { 'pokemon-go-table': requests } }
}

const createBatchAddObject = (items) => {
  const requests = []
  items.forEach(item => {
    const request = {
        encounter_id: { 'N': item.encounter_id.toString() },
        id: { 'N': item.id.toString() },
        latitude: {'N': item.latitude.toString() },
        longitude: {'N' : item.longitude.toString() },
        expires: {'N' : item.expires.toString() },
        expiresString: { 'S' : item.expiresString.toString() },
        name: { 'S' : item.name },
        directions: { 'S' : item.directions }
    }
    requests.push({ PutRequest: { Item: request } })
  })

  return { RequestItems: { 'pokemon-go-table': requests } }
}

const createGetObject = () => ({ 'TableName': 'pokemon-go-table'})


const addNew = (items) => {
  return new Promise((resolve, reject) => {
    if (items.length > 0) {
      const callback = (err, data) => err ? reject(err) : resolve(data)
      return DB.batchWriteItem(createBatchAddObject(items), callback)
    } else {
      resolve('Nothing to add')
    }
  })
}
const removeExpired = (items) => {
  return new Promise((resolve, reject) => {
    if (items.length > 0) {
      const callback = (err, data) => err ? reject(err) : resolve(data)
      return DB.batchWriteItem(createBatchDeleteObject(items), callback)
    } else {
      resolve('Nothing to delete')
    }
  })
}
const getCurrent = (items) => {
  return new Promise((resolve, reject) => {
    const callback = (err, data) => err ? reject(err) : resolve(data)
    return DB.scan(createGetObject(), callback)
  })
}

const toInt = (string) => parseInt(string.N,10)
const toFloat = (string) => parseFloat(string.N, 10)
const toString = (string) => string.S

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

module.exports = { addNew, removeExpired, getCurrent, toObject }
