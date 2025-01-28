/*
Name: Ronan Tsoi
Mod title: (The Cooler) Rocket Patrol
Development time: 9-11hrs?
Mods:
- New enemy spaceship type (5PTS)
    - Quantity of enemy spaceships subsequently increased to 4
- Mouse control with left click to fire (5PTS)
- Display time remaining in UI (3PTS)
- 4 new randomly selected explosion SFX (3PTS)
- New title screen (3pts)
- FIRE UI text (1PT)
- Display high score (1PT)
- Speed increase after 30sec (1PT)
Code Referenced:
Pointer hover detection- https://stackoverflow.com/a/71450826
*/

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    render: {
        pixelArt: true
    },
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)

//reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT

//UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

//high score
let highScore = 0