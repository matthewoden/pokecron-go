const cron = require('node-cron')
const config = require('./config')
const Tracker = require('./src/main')

const tracker = new Tracker(config)
task = cron.schedule('0,30 * * * * *',tracker, false)
task.start()
