# Unnamed RTS
Open-source RTS game inspired by Age Of Empires II but much simpler. You can see the current status at https://arogigante.itch.io/unnamed-rts

## What is this?
This is a game I will use to learn game development. The initial idea is very basic but I intend to construct it in a way that allows me for many further improvements and evolutions.
We are using [Phaser3](https://phaser.io) JS framework.

## Game concept
You can check the concept of the game on this [document](https://docs.google.com/document/d/1VEOTnC9N4-9KWOarlTR5_SHRbzlGuOpvtSXMWkIF8vs/edit?usp=sharing).

## Development

### Notes
Notes can be found [here](docs/dev-notes.md).

### Tasks
Tasks can be found [tasks](docs/tasks.md).

### Start local server
```
npm run start
```

### Build and deploy
```
npm run build
./publishing/butler push dist/ arogigante/unnamed-rts:web
```
