'use strict'

const PushBullet = require('pushbullet')
const token = process.env.POKEMON_PUSHBULLET_TOKEN

const pb = new PushBullet(token);
const target = { channel_tag: process.env.POKEMON_PUSHBULLET_CHANNEL }

const notify = (pokemon) => {
  return new Promise((resolve, reject) => {
    const callback = (err, data) => err ? reject(err) : resolve(data)
    const title = `A ${pokemon.name} is nearby!`
    const body = `Go here to catch it: \n${pokemon.directions} \n\n Better Hurry! It'll be gone ${pokemon.expiresString}`
    pb.note(target, title, body, callback)
  })
}

module.exports = { notify }
