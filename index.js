const cron = require('node-cron')
const main = require('./src/main')
const config = require('./config')

task = cron.schedule('0,30 * * * * *', main.bind(null, config), false)
task.start()
