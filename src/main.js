const _ = require('lodash')
const PushbulletClient = require('./pushbullet');
const PokemonClient = require('./pokemon');
const DatabaseClient = require('./db');
const { logger, handleError } = require('./logger')

const filterPokemon = ([currentPokemon, nearbyPokemon]) => {
  const remainingPokemon = _.intersectionBy(nearbyPokemon, currentPokemon, 'encounter_id')
  const expiredPokemon = _.differenceBy(currentPokemon, remainingPokemon,'encounter_id')
  const newPokemon = _.differenceBy(nearbyPokemon, remainingPokemon, 'encounter_id')

  logger.log('debug', 'NEARBY', nearbyPokemon)
  logger.log('debug', 'KNOWN', currentPokemon)
  logger.log('debug', 'KNOWN (REMAINING)', newPokemon)
  logger.log('debug', 'EXPIRED', newPokemon)
  logger.log('debug', 'NEW', newPokemon)

  return { newPokemon, expiredPokemon }
}


module.exports = function (config) {
  // initialize
  const pokemonClient = PokemonClient(config.pokemon)
  const databaseClient = DatabaseClient(config.db)
  const pushbulletClient = PushbulletClient(config.notifications.pushbullet);

  return function () {
    logger.info('info', `Running at ${new Date().toString()}`)
    logger.log('info', `Simulating Login at ${JSON.stringify(config.location)}`)

    Promise
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
        logger.log('info', `Completed at ${new Date().toString()}`)
        logger.log('info', `Result: ${result.join('\n') || 'No updates \n'}`)
      })
      .catch(handleError)
  }
}
