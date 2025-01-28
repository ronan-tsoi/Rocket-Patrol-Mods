class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    create() {
        //this.add.text(20, 20, "Rocket Patrol Play")

         //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
        this.starfield.setInteractive()

        //green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0,0)
        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)

        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
        
        //add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship2', 0, 40, 2).setOrigin(0,0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*4, borderUISize*5 + borderPadding * 2, 'spaceship', 0, 20, 1).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width + borderUISize*2, borderUISize*6 + borderPadding * 4, 'spaceship2', 0, 30, 2).setOrigin(0,0)
        this.ship04 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding * 8, 'spaceship', 0, 10, 1).setOrigin(0,0)

        //define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        //initialize score
        this.p1Score = 0
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWitdh: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)
        this.fire = this.add.text(this.game.config.width - borderUISize - borderPadding*8, borderUISize + borderPadding*2, 'FIRE', scoreConfig)
        this.record = this.add.text(borderUISize + borderPadding*8, borderUISize + borderPadding*2, 'HS:' + highScore, scoreConfig)
        
        // game over flag
        this.gameOver = false

        // 60-second play clock
        scoreConfig.fixedWidth = 0
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAMEOVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5)
            this.gameOver = true
        }, null, this)
        // display
        this.timerdisplay = this.add.text(game.config.width/2 - 36, borderUISize + borderPadding*2, '', {
            fontFamily: 'Courier',
            fontSize: '48px',
            color: '#FFFFFF'
        })
        this.mousemode = this.add.text(game.config.width/2 - 196, game.config.height - borderPadding*2, '', {
            fontFamily: 'Courier',
            fontSize: '16px',
            color: '#000000'
        })

        this.input.on("pointerdown", (pointer) => {
            if (pointer.isDown && !this.p1Rocket.isFiring && this.inframe && !this.gameOver) {
                this.p1Rocket.x = pointer.x
                this.p1Rocket.isFiring = true
                this.p1Rocket.sfxShot.play()
            }
        })
        this.starfield.on("pointerover", () => {
            this.inframe = true
            //console.log('pointer in frame')
            this.mousemode.text = '( CLICK OFF WINDOW TO EXIT MOUSE CONTROLS )'

        })
        this.starfield.on("pointerout", () => {
            this.inframe = false
            //console.log('pointer out of frame')
            this.mousemode.text = ''
        })

        this.starfieldVelocity = 4
    }

    update() {
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
            if (this.p1Score > highScore) {
                highScore = this.p1Score
            }
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
            if (this.p1Score > highScore) {
                highScore = this.p1Score
            }
        }

        this.starfield.tilePositionX -= this.starfieldVelocity
        if (!this.gameOver) {
            this.p1Rocket.update()
            this.ship01.update()
            this.ship02.update()
            this.ship03.update()
            this.ship04.update()
            
            let countdown = (game.settings.gameTimer/1000) - Math.round(this.clock.getElapsed()/1000)
            this.timerdisplay.text = countdown
            
            if (!this.p1Rocket.isFiring && this.inframe 
                && this.input.x >= borderUISize
                && this.input.x <= game.config.width - borderUISize) {
                this.p1Rocket.x = this.input.x
            }
        }

        if (Math.round(this.clock.getElapsed()/1000) == 30) {
            console.log('increasing speed')
            this.ship01.moveSpeed *= 1.009
            this.ship02.moveSpeed *= 1.009
            this.ship03.moveSpeed *= 1.009
            this.ship04.moveSpeed *= 1.009
            this.starfieldVelocity *= 1.007

        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.shipExplode(this.ship04)
            this.p1Rocket.reset()
            this.ship04.reset()
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.shipExplode(this.ship03)
            this.p1Rocket.reset()
            this.ship03.reset()
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.shipExplode(this.ship02)
            this.p1Rocket.reset()
            this.ship02.reset()
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.shipExplode(this.ship01)
            this.p1Rocket.reset()
            this.ship01.reset()
        }
    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true
        } else {
            return false
        }
    }

    shipExplode(ship) {
        ship.alpha = 0
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        this.fire.text = ''
        boom.anims.play('explode')
        boom.on('animationcomplete', () => {
          ship.reset()
          ship.alpha = 1
          boom.destroy()
          this.fire.text = 'FIRE'
        }) 
        // score add and text update
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score    
        
        let index = Math.round((Math.random() * 4) + 1)
        this.sound.play('sfx-explosion' + index)
      }
}