'use strict'
const PushBullet = require('pushbullet')
const { promisify }  = require ('../util')

module.exports = function (config) {
  const { token, channel } = config
  const target = { channel_tag: channel }
  const pb = new PushBullet(token);
  const createNote = pb.note.bind(pb)

  const notify = (pokemon) => {
    const title = `A ${pokemon.name} is nearby!`
    const body = `Go here to catch it: \n${pokemon.directions} \n\n Better Hurry! It'll be gone ${pokemon.expiresString}`
    return promisify(createNote)(target, title, body)
  }

  return { notify }
}
