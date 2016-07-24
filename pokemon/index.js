'use strict'
const api = require('pokemon-go-api');
const _ = require('lodash')
const moment = require('moment')
const pokemon = require('./pokelist.json').pokemon

const username = process.env.POKEMON_USER;
const password = process.env.POKEMON_PASS;
const provider = process.env.POKEMON_PROVIDER;

const longToInt = (long) => parseInt(long.toString(), 10)

const getDirections = (destination) =>
    `https://www.google.com/maps/dir/Current+Location/${destination.latitude},${destination.longitude}?dirflg=w`

const pokemonIdAndLocation = (p) => {
  const expires = longToInt(p.expiration_timestamp_ms)
  return {
    encounter_id: longToInt(p.encounter_id),
    id: p.pokemon_id,
    latitude:p.latitude,
    longitude: p.longitude,
    expires: expires,
    expiresString: moment(expires).fromNow()
  }
}

const getNearbyPokemon = (latitude, longitude) =>
  api
    .login(username, password, provider)
    .then(() => api.location.set('coordinates', latitude, longitude))
    .then(api.getPlayerEndpoint)
    .then(api.mapData.getNearby)
    .then((nearbyItems) =>
      nearbyItems
        .map(item => item.catchable_pokemon.map(pokemonIdAndLocation))
        .reduce((a, b) => [].concat(a).concat(b))
        .map(item => {
          const directions = getDirections({ latitude: item.latitude, longitude: item.longitude })
          const name = _.find(pokemon, { id: item.id.toString() }).name
          return _.extend({}, item, { name, directions })
        }))

module.exports = { getNearbyPokemon }
