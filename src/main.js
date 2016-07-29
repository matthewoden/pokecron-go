const _ = require('lodash')
const PushbulletClient = require('./pushbullet');
const PokemonClient = require('./pokemon');
const DatabaseClient = require('./db');
const random = require('./random')

const filterPokemon = ([currentPokemon, nearbyPokemon]) => {
  const remainingPokemon = _.intersectionBy(nearbyPokemon, currentPokemon, 'encounter_id')
  const expiredPokemon = _.differenceBy(currentPokemon, remainingPokemon,'encounter_id')
  const newPokemon = _.differenceBy(nearbyPokemon, remainingPokemon, 'encounter_id')
  return { newPokemon, expiredPokemon }
}

module.exports = (config) => {
  // initialize
  const pokemonClient = new PokemonClient(config.pokemon)
  const databaseClient = new DatabaseClient(config.db)
  const pushbulletClient = new PushbulletClient(config.notifications.pushbullet);

  // TODO: Investigate Issue: AWS-SDK lets a ETIMEDOUT slip through without returning an error in the callback.
  // For now, wrapping in try/catch.

  try {
    console.log(`Running at ${new Date().toString()}`)
    console.log(`Simulating Login at ${JSON.stringify(config.location)}`)
    return Promise
      .all([
        databaseClient.getCurrent(),
        pokemonClient.getNearbyPokemon(config.location)
      ])
      .then(filterPokemon)
      .then(({ newPokemon, expiredPokemon}) => {
        const notifications = newPokemon.map(pushbulletClient.notify)
        const databaseUpdates = databaseClient.update(newPokemon, expiredPokemon)

        return Promise.all(notifications.concat(databaseUpdates))
      })
      .then((result) => {
        console.log(`Completed at ${new Date().toString()}`)
        console.log(`Result: ${result.join('\n')}`)
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
