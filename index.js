const pokeClient = require('./pokemon/')
const db = require('./db/')
const pushbullet = require('./pushbullet/')
const _ = require('lodash')

const latitude = parseFloat(process.env.POKEMON_LAT)
const longitude = parseFloat(process.env.POKEMON_LON)
const interval = 30*1000

function main() {
  console.log(`Running at ${new Date().toString()}`)
  return Promise.all([
    db.getCurrent(),
    pokeClient.getNearbyPokemon(latitude, longitude)
  ])
    .then((resultArray) => {
      const currentPokemon = resultArray[0].Items.map(item => db.toObject(item))
      const nearbyPokemon = resultArray[1]
      const now = new Date().getTime();
      const remainingPokemon = currentPokemon.filter(pokemon => pokemon.expires > now )
      const expiredPokemon = currentPokemon.filter(pokemon => pokemon.expires < now )
      const newPokemon = _.differenceBy(nearbyPokemon, remainingPokemon, 'encounter_id')
      return Promise.all([
          db.addNew(newPokemon),
          db.removeExpired(expiredPokemon),
        ].concat(newPokemon.map(pushbullet.notify)))
    })
    .then((result) => {
      console.log(`Result: ${result}`)
      console.log(`Completed at ${new Date().toString()}`)
    })
    .catch((err) => {
      console.log(`Error at ${new Date().toString()}`)
      console.log(`Result: ${err}\n${err.stack}`)
    });
}

function run () {
  main()
  setInterval(main,interval)
}

run()
