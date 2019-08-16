/// <reference path="../node_modules/phaser/types/phaser.d.ts" />
const getRandom = (max, min = 0) => {
  return ~~(Math.random() * (max - min + 1)) + min;
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

    this.player = player
    this.physics.add.existing(player)
    player.setCollideWorldBounds(true)
    
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
    
    const addPhysics = GameObject => {
      this.physics.add.existing(GameObject);
      GameObject.body.immovable = true;
      GameObject.body.moves = false;
    }
    this.usingQueue = []
    this.unuseQueue = []
    this.add.tileSprite(215, height / 2, 110, 110, 'ball1')
    this.add.tileSprite(215 + 110, height / 2, 110, 110, 'ball1')
    this.add.tileSprite(215 + 110 * 2, height / 2, 110, 110, 'ball1')
    this.add.tileSprite(215 + 110 * 3, height / 2, 110, 110, 'ball1')
    this.add.tileSprite(215 + 110 * 4, height / 2, 110, 110, 'ball1')
    this.add.tileSprite(215 + 110 * 5, height / 2, 110, 110, 'ball1')
    this.add.tileSprite(215 + 110 * 6, height / 2, 110, 110, 'ball1')
    this.add.tileSprite(215 + 110 * 7, height / 2, 110, 110, 'ball2')
    // balls create
    // for (let i = 0; i < 10; i++) {
    //   let randX = getRandom(7, 0)
    //   this['ball' + i] = this.add.tileSprite(220 + 110 * randX, -110 , 110, 110, `ball${i % 5 + 1}`)
    //   addPhysics(this['ball' + i])
    //   this.unuseQueue.push(this['ball' + i])
    //   this.physics.add.collider(player, this['ball' + i], onHit)
    // }
    // this.usingQueue.push(...this.unuseQueue.splice(0, 1))

    // timerWrapper
    const toTimeString = () => ('0' + ~~(this.time / 60)).slice(-2) + ':' + ('0' + this.time % 60).slice(-2);
    let timerWrapper = this.add.container(1010, 0)
    timerWrapper.setSize(190, 130)
    let timerRect = this.add.graphics()
    timerRect.fillStyle(0x262626, 1)
    timerRect.fillRoundedRect(0, 0, 190, 130, {
      tl: 0, tr: 0, bl: 30, br: 30
    })
    timerWrapper.add(timerRect)
    let timeText = this.add.text(21, 17, 'TIME', {
      fontFamily: 'Roboto',
      fontSize: 14,
      color: 'white'
    })
    let timeCountdown = this.add.text(23, 40, toTimeString(), {
      fontFamily: 'Roboto',
      fontSize: 58,
      color: 'white'
    })
    timeCountdown.setFontStyle('bold')
    timerWrapper.add(timeText)
    timerWrapper.add(timeCountdown)
    this.timer = setInterval(() => {
      this.time--
      timeCountdown.setText(toTimeString())
    }, 1000)

    // end theme
    let backgroundFill = this.add.graphics({
      x: 0,
      y: 0
    })
    backgroundFill.fillStyle(0x000000, 0.2)
    backgroundFill.fillRect(0, 0, width, height)
    let failedRect = this.add.graphics()
    failedRect.fillStyle(0xffffff, 1)
    let failedWrapper = this.add.container(width / 2 - 350, height / 2 - 90)
    failedWrapper.setSize(700, 180)
    failedWrapper.add(failedRect)
    failedRect.fillRoundedRect(0, 0, 700, 180, 30)
    let btn = this.add.tileSprite(350, 126, 150, 55,'btn')
    failedWrapper.add(btn)
    let failedTitle = this.add.text(281, 20, 'UH-OH! 觸礁了', {
      color: '#ff952b',
      fontSize: '20px',
      align: 'center',
      fontFamily: 'Noto Sans TC',
    })
    let self = this
    function onHit (_player, _rock) {
      self.isEnd = true
      failedWrapper.setVisible(true)
      backgroundFill.setVisible(true)
      player.anims.play('dead')
      clearInterval(self.timer)
    }
    failedTitle.setFontStyle('bold')
    failedWrapper.add(failedTitle)
    let failedBody = this.add.text()
    failedBody.setSize(474)
    failedBody.setPosition(240, 57)
    failedBody.setColor(0x707070)
    failedBody.setFontFamily('Noto Sans TC')
    failedBody.setFontSize(14)
    failedBody.setText('勝敗乃鴨家常事，大俠重新來過吧~')
    failedWrapper.add(failedBody)
    let failedBtnText = this.add.text(310, 111, '重新挑戰', {
      color: 'white', fontSize: 20, fontFamily: 'Noto Sans TC'
    })
    failedWrapper.add(failedBtnText)
    failedWrapper.setVisible(false)
    backgroundFill.setVisible(false)
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

    if (keyboard.right.isDown && this.player.x <= width - 215) {
      this.player.x += 4
    } else if (keyboard.left.isDown && this.player.x >= 215) {
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
    gameFinish,
    gamePlay,
  ]
}

const game = new Phaser.Game(config)
