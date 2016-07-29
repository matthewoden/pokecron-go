# PokeCron GO (node) v2.0

PokeCron is an example of pinging the pokemon go server, and triggering a notification service (pushbullet) about new nearby pokemon, complete with walking directions. New updates include filtering.

## Why?
Passive play. I could run the app on my phone all day, but this uses less of my data plan. This can check pokemon at work, at home, near an outing I plan to be at later, etc.

Sure, there are plenty of pokemon maps out there, but I have to actually look at the map, wait for it to load, hope the information is still accurate, and figure out how to get to where the pokemon is. PokeCron go notifies me about new pokemon, and gives walking directions to that location.

With PushBullet, I can choose to mute it when I'm busy, and activate it when I'm ready.

## You're incredibly lazy.
Yes.


## Environment
- This example composes several services together: AWS (DynomoDB), the Pokemon Go API, Pushbullet, and Google Walking directions, so there's a few environment variables. Look at config.js for everything required.
- This project does use native c modules, which can make things annoying if bundling and deploying from Unix to Linux. (Like, say, for AWS Lambda)

## Database
The project currently uses DynamoDB, with a **Primary Index (Number)** of `encounter_id` and a **Sort Index (Number)** of `id`. This choice was made so that I could find an excuse to use DynamoDB for something, and will eventually be removed as this project progresses towards an Electron app.

## Running
Got a DynamoDB table set up? Got a PushBullet API key and Channel? Set up your secondary Pokemon account? Great! Throw all of that into `config.js` and type the magic words:
`npm run start`


## Changelog
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
