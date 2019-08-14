/// <reference path="../node_modules/phaser/types/phaser.d.ts" />
const getRandom = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/** @type {Phaser.Scene} */
const gamePlay = {
  key: 'gamePlay',
  preload () {
    this.load.image('bg', './assets/img_BG.svg')
    this.load.image('ducky', './assets/duck_normal_01.svg')
    this.load.spritesheet('duck', './assets/duck-sprite.png', { frameHeight: 230, frameWidth: 130 })
    this.load.spritesheet('super-duck', './assets/duck-super.png', { frameHeight: 230, frameWidth: 185 })
    this.load.image('ball1', './assets/Ball_01.svg')
    this.load.image('ball2', './assets/Ball_02.svg')
    this.load.image('ball3', './assets/Ball_03.svg')
    this.load.image('ball4', './assets/Ball_04.svg')
    this.load.image('ball5', './assets/Ball_05.svg')
    this.load.image('btn', './assets/btn_start_off.svg')
    this.load.image('btn-click', './assets/btn_start_off_click.svg')
    this.timer = -1
    this.time = 90
    this.level = 0
    this.isEnd = false
  },
  create () {
    this.bg = this.add.tileSprite(width / 2, height / 2, width, height, 'bg')
    let player = this.physics.add.sprite(width / 2, height - 130, 'duck')
    let btn = this.add.tileSprite(width / 2, height / 2, 150, 55,'btn')
    btn.setVisible(false)
    this.player = player
    this.physics.add.existing(player)
    player.setCollideWorldBounds(true)
    btn.setInteractive()
    btn.on('pointerdown', () => {
      btn.setTexture('btn-click')
      btn.setSize(150, 50)
    })
    btn.on('pointerup', () => {
      btn.setTexture('btn')
      btn.setSize(150, 55)
      this.scene.start('gamePlay')
    })
    // player.setInteractive(() => console.log('test'))
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('duck', { start: 1, end: 3 }),
      frameRate: 5,
      repeat: -1
    })
    this.anims.create({
      key: 'super',
      frames: this.anims.generateFrameNumbers('super-duck', { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1
    })
    this.anims.create({
      key: 'dead',
      frames: this.anims.generateFrameNumbers('duck', { start: 0, end: 0 }),
      frameRate: 5,
      repeat: -1
    })
    const onHit = (_player, _rock) => {
      this.isEnd = true
      btn.setVisible(true)
      player.anims.play('dead')
    }
    const addPhysics = GameObject => {
      this.physics.add.existing(GameObject);
      GameObject.body.immovable = true;
      GameObject.body.moves = false;
    }
    this.usingQueue = []
    this.unuseQueue = []
    // balls create
    for (let i = 0; i < 10; i++) {
      let randX = getRandom(9, 0)
      this['ball' + i] = this.add.tileSprite(110 + 110 * randX, -110 , 110, 110, `ball${i % 5 + 1}`)
      addPhysics(this['ball' + i])
      this.unuseQueue.push(this['ball' + i])
      this.physics.add.collider(player, this['ball' + i], onHit)
    }
    this.usingQueue.push(...this.unuseQueue.splice(0, 1))
  },
  update () {
    if (this.isEnd) {
      return
    }
    const keyboard = this.input.keyboard.createCursorKeys()
    for (let i = 0; i <= this.usingQueue.length - 1; i++) {
      this.usingQueue[i].y += 4
    }
    for (let i = this.usingQueue.length - 1; i >= 0; i--) {
      if (this.usingQueue[i].y >= height + 110) {
        this.unuseQueue.push(...this.usingQueue.splice(i, 1))
        this.usingQueue.push(...this.unuseQueue.splice(getRandom(9, 0), 1))
      }
    }
    if (keyboard.shift.isDown) {
      this.bg.tilePositionY -= 7
      this.player.anims.play('super', true)
      this.player.setSize(185, 230)
    } else {
      this.bg.tilePositionY -= 4
      this.player.anims.play('run', true)
      this.player.setSize(130, 230)
    }

    if (keyboard.right.isDown && this.player.x <= width - 210) {
      this.player.x += 4
    } else if (keyboard.left.isDown && this.player.x >= 210) {
      this.player.x -= 4
    }
  }
}

/** @type {Phaser.Types.Core.GameConfig} */
const config = {
  type: Phaser.AUTO,
  width,
  height,
  parent: 'app',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0
      },
      debug: true
    }
  },
  scene: [
    gamePlay
  ]
}

const game = new Phaser.Game(config)
