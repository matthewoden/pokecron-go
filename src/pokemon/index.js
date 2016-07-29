'use strict'
const api = require('pokemon-go-api');
const _ = require('lodash')
const moment = require('moment')
const { pokedex } = require('./pokedex.json')

const getDirections = (destination) =>
    `https://www.google.com/maps/dir/Current+Location/${destination.latitude},${destination.longitude}?dirflg=w`

const getSafeExpiration = (msRemaining) => {
  const now = new Date().getTime()
  const timestamp = now + msRemaining
  const inFifteenMinutes = moment().add(15, 'minutes').unix()*1000
  return timestamp < now ? inFifteenMinutes : timestamp;
}

const mapPokemonData = (pokemon) => {
  const {
    encounter_id,
    latitude,
    longitude,
    time_till_hidden_ms,
    pokemon_data: { pokemon_id }
  } = pokemon
  const expires = getSafeExpiration(time_till_hidden_ms)

  return {
    encounter_id: encounter_id.toString(),
    latitude,
    longitude,
    expires,
    id: pokemon_id,
    expiresString: moment(expires).fromNow()
  }
}

module.exports = function (config) {
  const uselessPokemon = config.filter

  const keepUseful = (pokemon) => !_.find(uselessPokemon, (id) => id === pokemon.id)

  const reducePokemon = (nearbyItems) =>
    nearbyItems
      .map(item => item.wild_pokemon.map(mapPokemonData))
      .reduce((a, b) => [].concat(a).concat(b))
      .filter(keepUseful)
      .map(item => {
        const directions = getDirections({ latitude: item.latitude, longitude: item.longitude })
        const { name } = _.find(pokedex, { id: item.id })
        return _.extend({}, item, { name, directions })
      })

  const getNearbyPokemon = ({ latitude, longitude}) =>
      api
        .login(config.username, config.password, config.provider)
        .then(() => api.location.set('coordinates', latitude, longitude))
        .then(api.getPlayerEndpoint)
        .then(api.mapData.getNearby)
        .then(reducePokemon)

  return {
    getNearbyPokemon
  }
}
