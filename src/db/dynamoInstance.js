const AWS = require('aws-sdk')

module.exports = ({ accessKeyId, secretAccessKey, region }) => {
  const DB = new AWS.DynamoDB({
    accessKeyId,
    secretAccessKey,
    region,
    apiVersion: '2012-08-10'
  });

  return DB
}
