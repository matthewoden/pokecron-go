'use strict'
const { promisify }  = require ('../util')
const pushbullet = require('./pushbullet')

module.exports = function (config) {
  const { token, channel } = config
  const target = { channel_tag: channel }
  const pb = pushbullet(token);
  const createNote = pb.note.bind(pb)

  const notify = (pokemon) => {
    const title = `A ${pokemon.name} is nearby!`
    const body = `Go here to catch it: \n${pokemon.directions} \n\n Better Hurry! It'll be gone ${pokemon.expiresString}`
    return promisify(createNote)(target, title, body)
      .then(() => `Sent Notification for ${pokemon.name} ${pokemon.encounter_id}`)
  }

  return { notify }
}
