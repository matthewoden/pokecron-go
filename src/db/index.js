const { promisify } = require('../util')

const createRemovalQuery = (removals) => {
  console.log(removals.map((removal) => removal._id))
  return { _id: { $in: removals.map((removal) => removal._id)} }
}


module.exports = function (config) {
  const db = require('./nedb.js')(config)
  const find = promisify(db.find.bind(db))
  const insert = promisify(db.insert.bind(db))
  const remove = promisify(db.remove.bind(db))

  const getCurrent = () => find({})

  const update = (additions, removals) => {
    if (additions.length > 0 || removals.length > 0) {
      return Promise.all([
        insert(additions),
        remove(createRemovalQuery(removals), { multi: true })
      ]).then(([additions, removals]) => {
        const additionsMessage = additions.length > 0 ? `added ${additions.length} pokemon: ${additions.map((a) => a.name)}` : ''
        const removalsMessage = removals.length > 0 ? `removed ${removals.length} pokemon: ${removals.map((r) => r.name)}` : ''
        return [additionsMessage,removalsMessage].join('\n')
      })
    } else {
      return 'no updates needed';
    }
  }

  return { getCurrent, update }
}
