const _ = require('lodash')
const PushbulletClient = require('./pushbullet');
const PokemonClient = require('./pokemon');
const DatabaseClient = require('./db');
const random = require('./random')

const walk = (number) => {
  const decimalPlaces = 6
  const powerOf10 = Math.pow(10,decimalPlaces)

  return (number * powerOf10 + random.integer(-1,1)) / powerOf10
}

const simulateMovement = ({latitude, longitude}) => ({
  latitude: walk(latitude),
  longitude: walk(longitude)
})

const filterPokemon = ([currentPokemon, nearbyPokemon]) => {
  const remainingPokemon = _.intersectionBy(nearbyPokemon, currentPokemon, 'encounter_id')
  const expiredPokemon = _.differenceBy(currentPokemon, remainingPokemon,'encounter_id')
  const newPokemon = _.differenceBy(nearbyPokemon, remainingPokemon, 'encounter_id')
  console.log(currentPokemon, nearbyPokemon, newPokemon, remainingPokemon, expiredPokemon)
  return { newPokemon, expiredPokemon }
}

module.exports = (config) => {
  // initialize
  const pokemonClient = new PokemonClient(config.pokemon)
  const databaseClient = new DatabaseClient(config.aws)
  const pushbulletClient = new PushbulletClient(config.notifications.pushbullet);

  // TODO: Investigate Issue: AWS-SDK lets a ETIMEDOUT slip through without returning an error in the callback.
  // For now, wrapping in try/catch.

  try {
    console.log(`Running at ${new Date().toString()}`)
    const simLocation = simulateMovement(config.location)
    console.log(`Simulating Login at ${JSON.stringify(simLocation)}`)
    return Promise
      .all([
        databaseClient.getCurrent(),
        pokemonClient.getNearbyPokemon(simLocation)
      ])
      .then(filterPokemon)
      .then(({ newPokemon, expiredPokemon}) => {
        const notifications = newPokemon.map(pushbulletClient.notify)
        const databaseUpdates = databaseClient.update(newPokemon, expiredPokemon)

        return Promise.all(notifications.concat(databaseUpdates))
      })
      .then((result) => {
        console.log(`Completed at ${new Date().toString()}`)
        console.log(`Result: ${result}`)
      })
      .catch((err) => {
        console.log(`Error at ${new Date().toString()}`)
        console.log(`Result: ${err}\n${err.stack}`)
      })
  } catch (e) {
    console.log(`Error at ${new Date().toString()}`)
    console.log(`Result: ${e}\n${e.stack}`)
  }
}
