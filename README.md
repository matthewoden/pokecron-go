# PokeCron GO (node)

PokeCron is an example of pinging the pokemon go server, and triggering a notification service (pushbullet) about new nearby pokemon, complete with walking directions.

## Why?
Passive play. I could run the app on my phone all day, but this uses less of my data plan. This can check pokemon at work, at home, near an outing I plan to be at later, etc.

Sure, there are plenty of pokemon maps out there, but I have to actually look at the map, wait for it to load, hope the information is still accurate, and figure out how to get to where the pokemon is. PokeCron go notifies me about new pokemon, and gives walking directions to that location. 

With pushbullet, I can choose to mute it when I'm busy, and activate it when I'm ready.

## You're incredibly lazy.
Yes.

## Environment
- This example composes several services together: AWS (DynomoDB), the Pokemon Go API, Pushbullet, and Google Walking directions, so there's a few environment variables. Look at sample.env for everything required.
- This project does use native c modules, which can make things annoying if bundling and deploying from Unix to Linux. (Like, say, for AWS Lambda)

## Running
It's pretty simple to get going.
`npm run start`

## Roadmap
 - Tests.
 - Convert task to Lambda Function (VM?)
 - Or use some kind of cron module that takes cron expressions?
