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
- ⚠️  This new position is not considered for further collisions.
