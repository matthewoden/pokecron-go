module.exports = {
  location: {
    latitude: parseFloat(process.env.POKEMON_LAT),
    longitude: parseFloat(process.env.POKEMON_LONG),
  },
  aws: {
    accessKeyId:process.env.POKEMON_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.POKEMON_AWS_SECRET_ACCESS_KEY,
    region: process.env.POKEMON_AWS_REGION,
    table: process.env.POKEMON_AWS_DYNAMO_TABLE_DEV
  },
  pokemon: {
    username: process.env.POKEMON_USER,
    password: process.env.POKEMON_PASS,
    provider: process.env.POKEMON_PROVIDER,
    // list of pokemon ids: see pokelist.json
    filter: []
  },
  notifications: {
    pushbullet: {
      channel: process.env.POKEMON_PUSHBULLET_CHANNEL,
      token: process.env.POKEMON_PUSHBULLET_TOKEN
    },
    // TODO: Implement slack notification option
    slack: {
      channel: process.env.POKEMON_PUSHBULLET_CHANNEL,
      token: process.env.POKEMON_PUSHBULLET_TOKEN
    }
  },
}
