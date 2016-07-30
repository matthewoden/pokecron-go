const { promisify } = require('../util')

const createRemovalQuery = (removals) => {
  return { _id: { $in: removals.map((removal) => removal._id)} }
}

module.exports = function (config) {
  const db = require('./nedb.js')(config)
  const find = promisify(db.find.bind(db))
  const insert = promisify(db.insert.bind(db))
  const remove = promisify(db.remove.bind(db))

  const getCurrent = () => find({})

  const batchUpdate = (additions, removals) => {
    if (additions.length > 0 || removals.length > 0) {
      return Promise.all([
        insert(additions),
        remove(createRemovalQuery(removals), { multi: true })
      ])
    } else {
      return Promise.resolve([null, null])
    }
  }

  const update = (additions, removals) => {
    batchUpdate(additions, removals)
    .then(([added, removed]) => {
        const addedMessage = added.length > 0 ? `Added ${added.length} pokemon: ${additions.map((a) => a.name)}` : ''
        const removedMessage = removed.length > 0 ? `Removed ${removed.length} pokemon: ${removals.map((r) => r.name)}` : ''
        return [additionsMessage,removalsMessage].join('\n')
      })
  }

  return { getCurrent, update }
}
