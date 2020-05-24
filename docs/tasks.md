## Tasks

## Pipeline

- [x] Add "You survived for XX time" message with a "restart" button when dead. Store best score?
- [x] [offcamera] 🐛 Blurry text
- [x] [offcamera] Updating the game concept documentation.
- [x] 🐛 Enemies still being created after game is over
- [x] 🐛 Enemies still moving after game is over
- [x] 🧠 Check how clock / gameTime works. Check this: https://photonstorm.github.io/phaser3-docs/Phaser.Time.Clock.html
- [x] Change enemies creation to a fixed 1 minute interval
- [x] Camera. - Implement camera. - Implement map borders.
- [x] Move to a scene-managed system - Doc: https://phaser.io/phaser3/devlog/119 - Move UI (GUI and GameOverScreen) to a separate scene (above the game scene)
- [x] 🐛 Zooming breaks UI (it's out of the camera and game pauses, so...)
- [x] Have it playable somewhere (github.io) - https://aaronfc.github.io/unnamed-rts
- [x] 🎉 Basic game concept done! 0.1 version -
- [x] 🐛 \_randomInt is not defined when enemies are created
- [x] Adjust size for screen
- [x] Tune up the "basic game numbers"? Enemy creation random ranges. Health. Resource. Time... Adding more resources around the map... - Set waves to happeng every 1 minute increasing in size. - Set more resources along the map.
- [ ] Multi-selection
- [ ] Make zooming work with the mouse scroll event
- [ ] [improvement] Make map smaller
- [ ] [improvement] Move Game Over to different scene
- [ ] 🐛 Zooming / blurry on Firefox
- [ ] 🐛 Pause time when game is paused (changing to different tab)
- [ ] 🐛 Timer delay (already workarounded but after moving preload to separate scene maybe it's fixed)
- [ ] Move preload to boot scene / menu
- [ ] Document: Github Pages
- [ ] 🐛 villager-icon key already in use - Fix: Move all images loading to a booting scene
- [ ] Revamp game-over screen style
- [ ] Study alternatives to accessing Scene's data directly from, for example, GameOverSceen. Scene Registry?
- [ ] Keep score leader board or similar
- [ ] Look into a proper Events manager. We need a way to remove all the listener for a given entity.
- [ ] Villager refactor: Extract status to Tasks
- [ ] 🧠 Review documentation notes and tasks and plan future versions (0.2)
- [ ] Randomly generate map. - Main building position and resources. - Document that in the [game document][1].
- [ ] Implement enemy waves
- [ ] Add "you are being attacked" alert.
- [ ] Add "scenes" to the game. - Loading screen. - Main menu - Game (everything done until now)

## Done

- [x] Extract building to a separate class
- [x] Check if `.update()` has to be manually called or it's already called by adding the GameObject to the scene. - We need it!
- [x] Migrate "movement" to a "walking-to-position" status.
- [x] Refactor: Generify the walking to "somewhere" behaviour. - Yes, we did it but only the first phase.
- [x] Resource depletion. - Resource representation: for the moment play with opacity. - When empty, resource should be destroyed. - Implement logic on villagers for when Resource is destroyed.
- [x] Make game bigger for stream
- [x] GUI - Create "Game Counters / Score" - Number of villagers - Game time - Amount of resource
- [x] Make GUI more fancy - Text is blurry because of the canvas manual resizing done in index.html - Time needs to be formatted properly so that we have minutes and hours - Increase depth level so that GUI is over the rest of the game - Add icons
- [x] Bugfixing / Debugging villagers movement issues - [X] #1 🐛 Villagers are overlapping one with eachother when crowded. - Maybe we can create some simplified test? To see if it's because of Arcade physics and find possible solutions. - More difficult to reproduce probably since we started using `physics.move` method. - Still happened, though... And can't find a way to reproduce. - After talking on Discord with @samme it seems like my initial guess was right. It seems a limitation on how Arcade Physics resolve collisions. They rely on a "Projection Method" which does not take into account any other collision. The only suggestion is to move to MatterJS physiscs engine. - Some MatterJS + Phaser3 tutorial [here][2] - [X] #2 🐛 Villagers moving infinitely upon collision - Set villagers as inmovable didn't work. Because when two bodies are immovable they won't collide (which kind-of makes sense). - Setting `drag` fixed the issue. But we spent a lot of time trying to set it up because we missunderstood the value passed to the `setDrag` method, it's not a percentage but an amount of pixel. - [X] #4 🐛 Villager might get into an unknown status when trying to gather resource and resource is destroyed. It was detected while doing a quick test by generating many villagers and sending them to consume the same resource. All of them behaved correctly (going back to initial position) except from one, which was "stuck" close to the already non-existent resource. ⚠️ This might be related to #3. - [X] #3 🐛 Villagers getting "stuck" while consuming resource. Not consuming and not moving. Maybe there is a gap between them and the resource but the movement is not getting them closer? - Increased the marging to consider an object as "closer" as possible to another one.
- [x] Moving to MatterJS physics engine
- [x] Add reference to Phaser3 in README.
- [x] Main Building / Villagers creation - Display actions popup. - Add button to create villager. - Make villager creation to cost resource and time - Avoid villagers stacking / overlapping on creation - Show basic info on villagers enqueued for creation - extra ball: show villager creation progress info
- [x] When a building is selected, all other entities should be unselected (villagers). Same for when a building is selected and we click on other entities (villagers).
- [x] Increase "drag" for villagers upon receiving a collision - using setFrictionAir
- [x] Slow down the collecting action
- [x] Refactoring villagers code preparing for enemies creation - Reduce `.target` and `.destination` entities into a single one. - Delegated the margin calculation to the `.target` object. - Extracted the if/else construction for movement to a separate method. - Extracted all movement related methods to a separated `movement.js`
- [x] GUI revamp - Use smaller icons (currently 512x512, which is too big) - Get an icon for time
- [x] Review if we can use `setFriction` instead of `setFrictionAir` - we can not
- [x] Basic enemies - Create the enemy entity - Make enemies logic to attack the villagers - Add "health" concept for villagers - Make enemies appear randomly (time and space)
- [x] 🐛 Support gathering speed for villagers higher than 1u/s
- [x] TownCenter + TownCenterMenu refactoring
- [x] 🐛 Villagers creation taking forever (over 100%)
- [x] Add defensive capabilities to Villagers - Refactor all fighting related logic from Enemy - Add health concept to enemies - Defend when attacked - Attack when commanded
- [x] 🐛 Make entities stop moving sliding when fighting
- [x] 🐛 Enemy not looking for closest enemy continuously
- [x] 🐛 When dying (enemy or villager) we should remove all listeners (added when selected for example)
- [x] Add some health bar or similar.
- [x] Do more testing about fighting and check the [game document][1]

# References

[1]: https://docs.google.com/document/d/1VEOTnC9N4-9KWOarlTR5_SHRbzlGuOpvtSXMWkIF8vs/edit#
[2]: https://itnext.io/modular-game-worlds-in-phaser-3-tilemaps-4-meet-matter-js-abf4dfa65ca1
