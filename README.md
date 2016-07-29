# PokeCron GO (node) v2.1.0

PokeCron is an example of pinging the pokemon go server, and triggering a notification service (pushbullet) about new nearby pokemon, complete with walking directions. New updates include filtering.

## Why?
Passive play. I could run the app on my phone all day, but this uses less of my data plan. This can check pokemon at work, at home, near an outing I plan to be at later, etc.

Sure, there are plenty of pokemon maps out there, but I have to actually look at the map, wait for it to load, hope the information is still accurate, and figure out how to get to where the pokemon is. PokeCron go notifies me about new pokemon, and gives walking directions to that location.

With PushBullet, I can choose to mute it when I'm busy, and activate it when I'm ready.

## You're incredibly lazy.
Yes.

## Configuration
Every instance of PokeCron Go requires a config file. By default, it uses config.js. You'll want to either set environment variables, or replace the values provided.

Currently, the only option not in configuration is the cron expression.

```javascript

//SAMPLE CONFIGURATION FILE
module.exports = {
  // the location you're scanning
  location: {
    // each of these should be a number, and probably a float.
    latitude: 38.618385,
    longitude: -90.217331,
  },
  // the datastore - a basic cache to determine if we've already seen the Pokemon received.
  db: {
    // whether or not to write the datastore to disk. Compacts every 5 minutes.
    memoryOnly: false
    // (optional) a path, relative to the root of the directory.
    datastore: './store/pokemon.db',
  },
  // information used to log into the pokemon servers.
  // ... probably don't want to use your main account here.
  pokemon: {
    username: 'username',
    password: 'pass',
    // one of the following: 'google' or 'ptc' (pokemon trainer's club)
    provider: 'google',
    // list of pokemon ids: see pokelist.json
    filter: [21, 151]
  },
  // Services that get notified about updates.
  notifications: {
    // pushbullet is used, because it's a mutable notification system.
    pushbullet: {
      channel: 'a string.',
      token: 'your pushbullet API key.'
    },
    // Coming Soon: slack notification option
    slack: {
      channel: 'some slack channel',
      token: 'some slack api key'
    }
  }
  ```

## Running
Got a PushBullet API key and Channel? Set up your secondary Pokemon account? Great! Throw all of that into `config.js` and type the magic words:
`npm run start`


## Changelog
 - 2.1
  - Replaced AWS DynamoDB with nedb
 - 2.0
  - Heavy code refactor.
  - Pass in config, rather than reference it via require. Now multiple configs/cron tasks can be used on a single thread.
  - Added Cron tasks.
  - Removal any use of process.env outside config file.
  - expanded `.gitignore`

## Roadmap
 - Remove AWS DB, in favor of something memory/file based storage.
 - Write Tests. It's all functional you big dummy, this should be easy.
 - Electron UI?
