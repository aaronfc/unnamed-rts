## Tasks

## Pipeline
- [X] Extract building to a separate class
- [X] Check if `.update()` has to be manually called or it's already called by adding the GameObject to the scene. - We need it!
- [X] Migrate "movement" to a "walking-to-position" status.
- [X] Refactor: Generify the walking to "somewhere" behaviour. - Yes, we did it but only the first phase.
- [X] Resource depletion.
	- Resource representation: for the moment play with opacity.
	- When empty, resource should be destroyed.
	- Implement logic on villagers for when Resource is destroyed.
- [X] Make game bigger for stream
- [X] GUI
	- Create "Game Counters / Score"
	- Number of villagers
	- Game time
	- Amount of resource
- [X] Make GUI more fancy
	- Text is blurry because of the canvas manual resizing done in index.html
	- Time needs to be formatted properly so that we have minutes and hours
	- Increase depth level so that GUI is over the rest of the game
	- Add icons
- [.] Bugfixing / Debugging villagers movement issues
	- [X] #2 🐛 Villagers moving infinitely upon collision
		- Set villagers as inmovable didn't work. Because when two bodies are immovable they won't collide (which kind-of makes sense).
		- Setting `drag` fixed the issue. But we spent a lot of time trying to set it up because we missunderstood the value passed to the `setDrag` method, it's not a percentage but an amount of pixel.
- [ ] Add reference to Phaser3 in README.
- [ ] Why is text still a little blurry?
- [ ] Refactor: Generify the moveCloserIfNotAsClosestAsPossible behaviour.
- [ ] Slow down the collecting action
- [ ] Main Building / Villagers creation
	- Display actions popup.
	- Add button to create villager.
	- Make villager creation to cost resource and time
	- Avoid villagers stacking / overlapping on creation
	- Show basic info on villagers enqueued for creation
- [ ] GUI revamp
	- Use smaller icons (currently 512x512, which is too big)
	- Get an icon for time
	- Add number formatting to resource amount (10,000 or maybe 10k)
- [ ] Create Enemy entity
	- [ ] Make enemies appear randomly (time and space)
	- [ ] Make enemies logic to attack the villagers
	- [ ] Add "health" concept for enemies and villagers
- [ ] Add defensive capabilities to Villagers
	- [ ] Defend when attacked
	- [ ] Attack when commanded
- Tune up the "basic game numbers"? Enemy creation random ranges. Health. Resource. Time...
- [ ] Add "You survived for XX time" message with a "restart" button when dead. Store record?
- 🎉 Basic game concept done! 0.1 version
- [ ] 🧠 Review documentation notes and tasks and plan future versions (0.2)
- [ ] Camera.
	- How the camera should work?
	- Document that in the [game document][1].
- [ ] Randomly generate map.
	- Main building position and resources.
	- Document that in the [game document][1].
- [ ] Implement enemy waves
- [ ] Add "you are being attacked" alert.
- [ ] Add "scenes" to the game.
	- Loading screen.
	- Main menu
	- Game (everything done until now)

## Bugs 🐛 
- [ ] #1 🐛 Villagers are overlapping one with eachother when crowded.
	- Maybe we can create some simplified test? To see if it's because of Arcade physics and find possible solutions.
	- More difficult to reproduce probably since we started using `physics.move` method.
	- Still happened, though... And can't find a way to reproduce.
	- After talking on Discord with @samme it seems like my initial guess was right. It seems a limitation on how Arcade Physics resolve collisions. They rely on a "Projection Method" which does not take into account any other collision. The only suggestion is to move to MatterJS physiscs engine.
	- Some MatterJS + Phaser3 tutorial here: https://itnext.io/modular-game-worlds-in-phaser-3-tilemaps-4-meet-matter-js-abf4dfa65ca1
- [ ] #3 🐛 Villagers getting "stuck" while consuming resource. Not consuming and not moving. Maybe there is a gap between them and the resource but the movement is not getting them closer?
- [ ] #4 🐛 Villager might get into an unknown status when trying to gather resource and resource is destroyed. It was detected while doing a quick test by generating many villagers and sending them to consume the same resource. All of them behaved correctly (going back to initial position) except from one, which was "stuck" close to the already non-existent resource. ⚠️ This might be related to #3.


# References
[1]: https://docs.google.com/document/d/1VEOTnC9N4-9KWOarlTR5_SHRbzlGuOpvtSXMWkIF8vs/edit#
