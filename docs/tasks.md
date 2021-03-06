## Tasks

## Stream related
- [ ] Next projects?
    - Improving skills
    - ...
    - Game jams (itch.io, suggested by @KadinsGameLounge)
    - Testing new frameworks / tools / libraries:
	- GameMaker

## Blog post ideas 📝
- Zoom control tricky to implement because I wanted to keep the same world position under the cursor **after** zooming in and out.
- Navigation part turned out very well. Pathfinding post already written and maybe more notes can be extracted.
- Deploying process to Github Pages

## Pipeline
- [ ] 🐛 When fighting villagers push other villagers (and the enemy) so they keep walking/while fighting and pushing the enemies in a straight line
  - Approaches:
    - 1) Increase range for villager/enemy attacks
    - ~~2) Do not push a friendly unit when trying to attack~~ -> This has been tested and generates some "excesively-polite" fighting. Many villagers in queue and only one fighting.
    - 3) Update the navigational mesh with all the units positions.
    - 4) Do something in the middle of 2 and 3. So basically detecting collision and trying to walk around in some heuristic-based behaviour.
- [ ] [Refactor] Merge Enemy and Villager classes into one or at least create a base one. Most of the code is duplicated.
- [ ] [Refactor] Enemy an Villager commands should be extracted to a separate CommandManager.
  - 💡 Maybe we can even merge this with the `runningOrders` logic implemented in TownCenter.
- [ ] [Refactor] Create an EventsManager.
	- 💡 We need a way to remove all the listener for a given entity.
	- ⚠️ Beware of the `removeAllListeners` method
- [ ] [Refactor] Make UI Scene consume the counters by using the registry instead of accessing the `MainScene`.
	- ℹ️ EXAMPLE: Detecting how many selected villagers we have in order to show or hide the action menu.
- [ ] [Refactor] Move enemies creation to a separate class - maybe `ai.js`?
- [ ] [Improvement] Extra villager improvements:
    - [ ] Pink coloring -> random colors? or random based on the nametag.
    - [ ] Font sizing - 8px seems big, and less seems small ... - maybe adjust size based on the zoom level (constant size no matter of zoom) - **maybe this means we must move this nametag to the UI scene**
    - [ ] Idea: nametag ui improvement - see Unnamed RTS doc's screenshot
    - [ ] Idea: show only the N older viewers? Or maybe randomly?
    - [ ] Idea: Make the nametags fade whenever we move the mouse close to them - mouseover or mouseout is not valid because we trigger the out whenever we hide the nametag (while being over it)
    - [ ] @polypiel's idea: Idea: add some basic commands from the chat. The owner could send /mine /attack /dance etc to its avatar
- [ ] [Doc] Update documentation
- [ ] [New] Buildings can be attacked and also destroyed/repaired.
- [ ] [Doc] Document different depth values used in the game - grep for `.depth`
- [ ] [Improvement] Corner case when villager can not find any resource available after exhausting one of them - he should go to the closest storage, store whatever he has, and go into idle status next to the building.
- [ ] [New] Display best score in Menu.
- [ ] [New] Display information about controlls in Menu -> 💡 Maybe it is better to show a random TIP.
- [ ] [Improvement] Buildings round 2
    - [ ] ❓ When a villager dies what happens with an ongoing action to start a building? (action menu open and the house being placed)
    - [ ] 💎 Improve building "progress" display (progress bar)
    - [ ] 💎 Mark unavailable buildings (not enough resource case) in the menu
    - [ ] 💎 Make `action_menu.js` generic so that we can have not only `building` actions but also any other actions - extract building logic to a separate `building_action.js` or sth like that.
- [ ] ⚠️  Add attribution to the house icon author: `Iconos diseñados por <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.es/" title="Flaticon"> www.flaticon.es</a>`
- [ ] [Improvement] Make visual representation for gameobjects animated. For example the campfire from the town center 🔥
- [ ] ⚠️  We had to manually add an empty `destroy()` function to the TiledGameObject. Maybe we will be leaking some memory? We need to double check that.
- [ ] [Improvement] 💡 Make TiledGameObject to understand Tiled output (should be easy to do, check [dev-notes](dev-notes))
- [.] Research design possibilities for the game:
	- [.] Check on free assets to add some basic styling to the game.
	    - [X] Identify assets that we really need:
		    - Grass
		    - Town center (big house / castle / camp)
		    - Resource (rocks tinted to pink or something similar?)
		    - Houses (for 0.4)
	    - [ ] What size should the assets be? Tilemap sizing?
	    - [ ] Get some assets
	    - [ ] ℹ️  Check on "Realm of the mad god" suggested by @BuccaneerDev
	    - [ ] ℹ️  Check twitch's https://www.twitch.tv/LumpyTouch suggested by @BuccaneerDev
	- [ ] Check on fonts and buttons/icons.
	- [ ] Check on assets for characters
	    - [ ] https://opengameart.org/content/roguelike-character-pack
	- [ ] Check on other assets
	    - [ ] https://opengameart.org/content/medieval-rts-120
- [ ] 🐛 While collecting resource sometimes entities keep collecting even though they were commanded to move. Probably there's a moment when they will just ignore the move command - check the collecting behaviour.
- [ ] 🐛 Seems like enemies could be generated in the "non-walkable-area" around buildings or resources.
- [ ] 💡 Have some "debug menu" that we can use to: generate enemies, generate villagers, toggle debug mode for the navigation mesh, etc
- [ ] Revamp game-over screen style
- [ ] 🐛 Pause time when game is paused (changing to different tab)
- [ ] 🐛 Timer delay (already workarounded but after moving preload to separate scene maybe it's fixed)
- [ ] 🐛 villager-icon key already in use - Fix: Move all images loading to a booting scene
- [ ] Keep score leader board or similar
- [ ] 💡 Make the "Next wave coming in 10 seconds" update the message every second @Chris2A
- [ ] Randomly generate map. - Main building position and resources. - Document that in the [game document][1].

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
- [x] [improvement] Make map smaller
- [x] 🧠 Review documentation notes and tasks and plan future versions (0.2) - Naming / Goal? Yes. - 0.1: Foundations - 0.2: Less annoying - 0.3: Home, phone - 0.4: In construction - 0.5: Tower defense
- [x] Multi-selection
- [x] Make zooming work with the mouse scroll event - We are still missing a way to keep the mouse in the same position after zooming in or out
- [X] 🐛 Stop prettifier from modifying markdown files
- [X] Alerts
	- Next wave is coming in X seconds! ✔️ 
	- Not enough resource! ✔️ 
	- Resource exhausted! ✔️ 
	- ...
- [X] Check why prettier is surrounding some lines with `(...),` - See GUI.js
- [X] Look into animations:
	- Camera: Zooming and panning ✔️ 
	- Alerts: Fading ✔️ 
- [X] 🐛 Alert messages broken after game-over restart
- [X] Add "Boot" scene - Move preload to boot scene / menu
- [X] Add "Menu" scene
- [X] Add "Game Over" scene
- [X] 🐛 While on game-over screen some events are still being triggered: `nextEnemiesWave` (alert and enemies) - Now the game-over screen has been replaced by a game over scene.
- [X] 🧠 Document Alerts behaviour.
- [X] Look up information about pathfinding on Phaser3.
- [X] Prepare 0.3 version tasks - focused on pathfinding
- [X] Game Over scenes completion:
	- Add best score. ✔️ 
	- Add custom message based on result. ✔️ 
	- Maybe some restyling? ✔️ 
- [X] Menu scene completion:
	- Add the game name ✔️ 
- [X] 🎉 0.2 version completed! - Less annoying!
- [X] Try https://github.com/amaccann/phaser-navmesh-generation with an empty tilemap (empty collisions array also) - check example and use the addSprite method.
	- ⚠️  We are having errors just by importing the plugin. - Need to check 
	- Seems like not useful for us because it was implemented for phaser-ce
- [X] Keep investigating solutions for pathfinding (get tasks from dev-notes)
- [X] Consider creating navmesh manually (or with an unknown plugin) and use: https://www.mikewesthad.com/navmesh/docs/#creating-a-navigation-mesh
	- [X] Generate the navmesh
	- [X] Display the navmesh in some kind of debug
	- [X] Test that findPath method returns a correct set of points
- [X] Integrating Pathfinding
	- [X] Make villagers follow a path when commanding to move somewhere
	- [X] ⚠️  Path is not optimal at all for some cases. Seems like it might be related with the heuristic being used by the library we are using. It's calculating distance from centroids which, for some cases with really big squares it seems not to make sense. - ✔️  Seems related to the heuristc being used, it's expected by the library itself and there's an open issue on Github for that waiting for an upcoming version. Workarounded by splitting big polygons into smaller ones with an `unoptimize()` method.
	- [X] Make villagers use pathfinding for moving from and to a resource
	- [X] Same for enemies ⚠️  Currently it's broken:
		```
		movement.js?8395:65 Uncaught TypeError: Cannot read property 'navigation' of undefined
    at Movement.moveTo (movement.js?8395:65)
    at Fighting.moveIntoAttackRangeAndAttack (fighting.js?4610:15)
    at Enemy.update (enemy.js?4efb:61)
    at eval (main.js?1339:222)
    at Array.forEach (<anonymous>)
    at MainScene.update (main.js?1339:222)
    at Systems.step (Systems.js?9339:381)
    at SceneManager.update (SceneManager.js?cec0:565)
    at Game.step (Game.js?22d5:475)
    at TimeStep.step (TimeStep.js?fdd3:599)
		```
	- [X] Manage situation when a resource is exhausted
	- [X] Special case: removing buildings or resources
	- [X] Special case: buildings or resources in multiple quadrants (2, 3, 4?)
	- [X] Special case: building overriding one or more quadrants
- [X] 🧠 Document what the 0.3 version (aka pathfinding) will be.
- [X] 🐛 After moving a villager around the map. An enemy appeared and attacked the villager even though it was really far from the villager. Seems like "villager position" was ghosting somewhere else and the enemy could attack the "ghost".
- [X] 🎉 O.3 version completed!
- [X] Play around with assets and game-object generation
    - [X] Generate a simple game object by composing the image from a spritesheet
    - [X] Base map generation (tilemap)
    - [X] Move all House logic to a generic class
    - [X] Spend some time figuring out how to choose the spritesheet frames more easily - Use Tiled
    - [X] Replace resource with equivalent composed object - we have some pink/purple crystals in the spritesheet
	- [X] ⚠️  It is not interactive anymore. `setInteractive` doesn't seem to work even though we pass the hitbox and a hitboxcallback method. **No idea how to progress here**.
    - [X] Support multi-layer composition (aka generate a camp with tents, campfire, floor,the  etc)
	- ⚠️  Supporting this might mean having to mess around with how the mesh is generated if we want to have collisions set to indivual parts and not the full camp as a whole. For example, colliding only with the base of the tents or the campfire.
    - [X] Replace towncenter with equivalent composed object - camp or big house?
- [X] 🐛 When trying to collect resources from a resource which is surrounded by other resources the "closest" point to the villager will be out of the navigation mesh. So we don't have a way to get there. 💡 Maybe we should make this "closest" point smarter or the navigation mesh less strict (allow to get to a point out of the map).
- [X] Get up to date with current situation.
- [X] Buildings!
    - [X] Villager building action
    - [X] Building being constructed progress ~
    - [X] Menu
	- [X] Display menu for building when villagers selected
	- [X] Enable placing building and starting a construction when clicked on the map. Make villagers build it.
	- [X] Do not allow for buildings to be constructed over resources or other buildings.
	- [X] If building can't be placed, we need to inform the user
	- [X] Update icons / assets for the menu (make it a little better looking)
	- [X] Display building cost per building
	- [X] Make the menu generic so that new building buttons appear automatically
    - [X] Make construction consume resources
	- The easiest way would be to not allow building over entities (in the end we won't allow to build over enemies)
    - [X] 🐛 When placing a building (to construct) we lose the "move" event when mouse is over anything different from the map (for example, entities like villagers or other buildings)
    - [X] 🐛 When we left-click while building, the next right-click will not work. Solution: left-click should stop the building process.
    - [X] 🐛 When houses are `.destroy()`ed something is not being correctly removed, since the input over the place that occupied the house doesn't work anymore. Reproduce: Click the build a house button, and then move over the map to somewhere. Click escape and the house will disappear. Now input on that same place will not work (try to use the multi-selection box)
    - [X] 🐛 When commanding a single unit to complete a construction the full group moves instead of only the selected one. Reproduce: Command all the entities to gather resource and then select a single unit and command to complete the construction of a started house.
- [X] Population control
    - [X] Create maximum population counter
    - [X] Display maximum counter in the GUI
    - [X] Accept new orders but do not execute them until we have free space for the new villagers.
    - [X] New house should increase by some amount (5) the maximum population counter until some predefined limit (200)
- [X] ~~*🐛 Can't place a tower after updating references and moving around classes*~~ [2021-01-26]
- [X] ~~*Code review + lessons learnt*~~ [2021-01-26]
  - [X] ~~*Refactoring on Villager and Enemy entities*~~ [2021-01-26]
    - [X] Extract all logic to commands
    - [X] Update Villager to use Commands
    - [X] Update Enemy to use Commands
    - [X] Generic Command for attacking enemies and/or villagers
    - [X] Create AI concept to command the enemies
    - [X] ~~*🐛 When enemy is attacking a villager we were creating one command everytime the AI was calling the `.attack()` method. Temporary fix: Checking on the `enemy.attack()` method for already running command. GOOD FIX: **I dont know**, maybe implementing `equals()` methods? Or maybe making the AI smarter so that it doesn't call everytime. Problem with that is that user could attack or gather more resource by rapid-clicking (which is essentially what the AI is doing).*~~ [2021-01-26]

# References

[1]: https://docs.google.com/document/d/1VEOTnC9N4-9KWOarlTR5_SHRbzlGuOpvtSXMWkIF8vs/edit#
[2]: https://itnext.io/modular-game-worlds-in-phaser-3-tilemaps-4-meet-matter-js-abf4dfa65ca1
