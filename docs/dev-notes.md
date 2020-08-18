# Dev Notes

Quick development notes.

## Collisions

Currently collisions are not working very well. Villagers sometimes go through limits (with other villagers or resources mostly).
Seems to be related to the fact that multiple villagers are moving in the same direction.
But body velocity does not seem to be increasing above the set value (50).
It might have to do with how arcade physics work and maybe 50 is a value for which the limiting pixel barrier is missed.
Some ideas:

- Lower the velocity to lower than 50 or increase it to see if it happens more or lessthan now.
- Stop calling moveTo on every update loop. Maybe this is generating the issue. Take into account that this might break the "correcting" behaviour after villagers collide with each other. Maybe we can check if it was colliding and if not then move.
- Villagers pushing one to another is nice, but after a villager stops pushing another one the second one should stop moving immediately.

## On calling update

Apparently if a GameObject has a `preUpdate` method, then the it will be added to the update list automatically.

- 💡 Maybe we can test that, on villagers or any other entity. But... What should be done in preUpdate and what in update?

## Arcade Physiscs engine limitations

Why collisions didn't work sometimes and some small gameobjects get overlapped when they should? This is basically a known limitation on the Arcade Physics game.
Collision resolution mechanism Projection Movement:

- Measures how much of an entity went "inside" another one.
- Based on this measure it calculates new position for the collision resolution.
- ⚠️ This new position is not considered for further collisions.

## About friction

We found out that there are three different values for Friction in MatterJS:

- default: Between 0 and 1. 0 allows the body to move indefinitely and 1 will stop almost immediately **after a force stops being applied**. - ⚠️ Apparently this is not working for collisions. An object with `setFriction(1)` will still move a lot after colliding.
- static: The higher this amount, the higher the energy you neeed to start moving this object.
- air: Resistance with the air when this object moves through the empty space.

Asked to Phaser Discord about how the setFriction method is supposed to work:

```
Hi! I recently migrated my small game to use MatterJS instead of arcade Physics.
In arcade I had the setDrag called so that my entities did not move that much after a collision.
Now on MatterJS I am trying to do the same. I found about the setFriction method. And I got it working as I want by using the setFrictionAir, but I do not understand why the "default" setFriction does not work. Based on the documentation I would expect it to work like this:
If I two bodies with friction set to 1, they shouldn't move at all after colliding. But they are moving a lot.
```

Answer from "コズミック":

```
setFriction works against bodies
so after your bodies collide and they seperate there's no more friction
while frictionAir is friction from air which is always there
```

## Origin

For texts, apparently the default origin is set to 0,0 and not to 0.5.

## Timer / delays / intervals

Apparently when using a Scene's `this.time.addEvent` to add a delayed callback we have an initial extra delay (some seconds). From the documentation it reads: "Creates a Timer Event and adds it to the Clock at the start of the frame". Seems like we do not understand this `at the start of the frame` thing.
For the moment we just went with out own implementation of delayed calls.


## Removing all events
Phaser has a method `removeAllListeners` that is a nuclear operation. It cleans up all the event listeners, **incluiding some that Phaser needs itself** so if you call it manually you are doomed.
Anowleternative: Call the `off(event)` method for every event you have registered.


## Time / Clock
When using `this.time.now` in the `create()` from an Scene the value is `0`. But later when used in the `update()` it will be a different value (not matching the initial 0 value).
https://photonstorm.github.io/phaser3-docs/Phaser.Time.Clock.html See `now` description.


## Pathfinding in Phaser3
- External libraries:
	- https://easystarjs.com/
		- Seems focused on solving pathfinding for tiled or grid-based maps? [needs confirmation]
	- https://www.mikewesthad.com/navmesh/docs/
		- Navigation meshed (faster than applygin A*)
		- Also requires tiled-map or navmesh generation
- Probably we will need to start using a tile-map.
- Other developers in a similar starting situation to ours:
	- https://gamedev.stackexchange.com/questions/119399/dynamic-navigation-mesh-generation-algorithm
		- Not very possitive comments.
		- Algorithms mentioned: Hertel-Melhorn Algorithm, 
	- https://gamedev.stackexchange.com/questions/31208/how-can-i-generate-a-2d-navigation-mesh-in-a-dynamic-environment-at-runtime
- amaccann/phaser-navmesh-generation:
	- ⚠️  We coldn't progress much because we have an error just by importing the package.
	- ERROR:
	```
    Uncaught TypeError: Super expression must either be null or a function, not undefined
    at o (navmesh-plugin.js?9b19:1)
    at eval (navmesh-plugin.js?9b19:1)
    at Object.eval (navmesh-plugin.js?9b19:1)
    at t (navmesh-plugin.js?9b19:1)
    at Object.eval (navmesh-plugin.js?9b19:1)
    at t (navmesh-plugin.js?9b19:1)
    at Object.eval (navmesh-plugin.js?9b19:1)
    at t (navmesh-plugin.js?9b19:1)
    at Object.eval (navmesh-plugin.js?9b19:1)
    at t (navmesh-plugin.js?9b19:1)
    	```
	**Probably this has to do with the plugin being implemented for phaser-ce and not phaser3**
	

## Adding assets
- Create GameObject from images ✔️ 
- Create GameObject from combined tiles from a tileset ❓
- Create map (without a tilemap) ❓

## Tiled output
```
{ "compressionlevel":-1,
 "editorsettings":
    {
     "export":
        {
         "format":"json",
         "target":"camp"
        }
    },
 "height":5,
 "infinite":false,
 "layers":[
        {
         "data":[521, 522, 522, 522, 522, 522, 523, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":5,
         "id":1,
         "name":"Tile Layer 1",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":7,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 522, 522, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":5,
         "id":2,
         "name":"Tile Layer 2",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":7,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 413, 413, 413, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":5,
         "id":3,
         "name":"Tile Layer 3",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":7,
         "x":0,
         "y":0
        }],
 "nextlayerid":4,
 "nextobjectid":1,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.3.1",
 "tileheight":16,
 "tilesets":[
        {
         "firstgid":1,
         "source":"rogelike-spritesheet.tsx"
        }],
 "tilewidth":16,
 "type":"map",
 "version":1.2,
 "width":7
}
```

## Action Menu (building) generic

Current:
[ HOUSE ]

Ideally:
[ HOUSE ] [ DEPOSIT ] [ TOWER ]

- All these three are buildings.
- All of them will cost some resource to be built.
- All of them will be built following the same mechanic.

Things we will need to have:
- List of things that can be built. For every one of them:
    - How much resource does it cost? For example: 50 for a House.
    - What entity represent this building. For example: House class for a house.

Generic Menu:
- Read list of things that can be built. For each of them:
    - Draw a button and the cost of building this item.
    - Actually trigger the right building mechanic depending on the item chosen.


## Asset for storages
- Tent with different color:
- Wooden cabin:
    - don't like the idea of having better houses for resource than for people
- Reuse Tents as storage also
    - we don't need to create a new entity, we can just reimplement the current one
Winner: Wooden cabin.
