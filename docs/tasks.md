# Tasks

## Pipeline
- [ ] Extract building to a separate class
- [ ] Check if `.update()` has to be manually called or it's already called by adding the GameObject to the scene.
- [ ] Migrate "movement" to a "walking-to-position" status.
- [ ] Resource depletion.
	- Resource representation: for the moment play with opacity.
	- When empty, resource should be destroyed.
	- Implement logic on villagers for when Resource is destroyed.
- [ ] GUI
	- Create "Game Counters / Score"
	- Number of villagers
	- Game time
	- Amount of resource
- [ ] Main Building / Villagers creation
	- Display actions popup.
	- Add button to create villager.
	- Make villager creation to cost resource and time
	- Avoid villagers stacking / overlapping on creation
	- Show basic info on villagers enqueued for creation
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
- [ ] Villagers are overlapping one with eachother when crowded.
	- Maybe we can create some simplified test? To see if it's because of Arcade physics and find possible solutions.


# References
[1]: https://docs.google.com/document/d/1VEOTnC9N4-9KWOarlTR5_SHRbzlGuOpvtSXMWkIF8vs/edit#
