/// <reference path="../node_modules/phaser/types/phaser.d.ts" />
const getRandom = (max, min = 0) => {
  return ~~(Math.random() * (max - min + 1)) + min;
}
/** @type {Phaser.Scene} */
const gamePlay = {
  key: 'gamePlay',
  preload () {
    console.log('loading')
    this.load.image('bg', './assets/img_BG.svg')
    this.load.image('ducky', './assets/duck_normal_01.svg')
    this.load.spritesheet('duck', './assets/duck-sprite.png', { frameHeight: 230, frameWidth: 130 })
    this.load.spritesheet('super-duck', './assets/duck-super.png', { frameHeight: 230, frameWidth: 185 })
    this.load.image('ball1', './assets/Ball_01.svg')
    this.load.image('ball2', './assets/Ball_02.svg')
    this.load.image('ball3', './assets/Ball_03.svg')
    this.load.image('ball4', './assets/Ball_04.svg')
    this.load.image('ball5', './assets/Ball_05.svg')
    this.load.image('star', './assets/SuperStar.svg')
    this.load.image('btn', './assets/btn_start_off.svg')
    this.load.image('btn-click', './assets/btn_start_off_click.svg')
    this.load.image('boss1', './assets/Boss_01.svg')
    this.load.image('boss2', './assets/Boss_02.svg')
    this.timer = -1
    this.time = 90
    this.level = 0
    this.isEnd = false
    this.notMoveIndex = getRandom(5)
    this.getStar = false
    this.normalSpeed = 4
    this.startStar = false
  },
  create () {
    console.log('create')
    this.bg = this.add.tileSprite(width / 2, height / 2, width, height, 'bg')
    let player = this.physics.add.sprite(width / 2, height - 80, 'duck')
    let star = this.add.tileSprite(0, -100, 90, 74, 'star')
    this.boss1Pos = [255 + 385 / 2, width / 2, width - 255 - 385 / 2]
    this.boss2Pos = [255 + 600 / 2, width - 255 - 600 / 2]
    let boss1 = this.add.tileSprite(this.boss1Pos[getRandom(2, 0)], -310, 385, 316, 'boss1')
    let boss2 = this.add.tileSprite(this.boss2Pos[getRandom(1, 0)], -430, 600, 422, 'boss2')
    this.boss1 = boss1
    this.boss2 = boss2
    boss1.setVisible(false)
    boss2.setVisible(false)
    this.star = star
    this.player = player
    this.physics.add.existing(player)
    player.setCollideWorldBounds(false)
    player.setInteractive()

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
    addPhysics(star)
    addPhysics(boss1)
    addPhysics(boss2)

    this.physics.add.collider(player, boss1, onHit)
    this.physics.add.collider(player, boss2, onHit)
    this.physics.add.collider(player, star, onStar)

    // balls create
    for (let i = 0; i < 6; i++) {
      this['ball' + i] = this.add.tileSprite(255 + 138 * (i % 6), -110, 110, 110, `ball${i % 5 + 1}`)
      addPhysics(this['ball' + i])
      this.physics.add.collider(player, this['ball' + i], onHit)
    }

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
    let self = this
    this.timer = setInterval(() => {
      this.time--
      timeCountdown.setText(toTimeString())
      if (this.time <= 0) {
        clearInterval(this.timer)
        this.scene.start('gameFinish')
        return
      }
      if ((this.time % 10) === 0) {
        star.setPosition(getRandom(255 + 138 * 5, 255 + 138), -110)
        this.startStar = true
      }
      if (this.time >= 60) {
        this.level = 0
      } else if (this.time < 60 && this.time >= 30) {
        this.level = 1
        this.normalSpeed = 6
      } else if (this.time >= 0) {
        this.normalSpeed = 8
        this.level = 2
      }
      console.log(this.level)
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
    let btn = this.add.tileSprite(350, 126, 150, 55, 'btn')
    failedWrapper.add(btn)
    let failedTitle = this.add.text(281, 20, 'UH-OH! 觸礁了', {
      color: '#ff952b',
      fontSize: '20px',
      align: 'center',
      fontFamily: 'Noto Sans TC',
    })
    function onHit (_player, _rock) {
      self.isEnd = true
      failedWrapper.setVisible(true)
      backgroundFill.setVisible(true)
      player.anims.play('dead')
      clearInterval(self.timer)
    }
    function onStar (_player, _rock) {
      self.startStar = false
      self.getStar = true
      star.y = -55
      for (let i = 0; i < 6; i++) {
        self['ball' + i].y = -110
      }
      boss1.y = -400
      boss2.y = -440
      setTimeout(() => {
        self.getStar = false
      }, 3000)
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
      btn.setPosition(350, 126 + 5)
      failedBtnText.setPosition(310, 116)
    })
    btn.on('pointerup', () => {
      btn.setTexture('btn')
      btn.setSize(150, 55)
      failedBtnText.setPosition(310, 111)
      btn.setPosition(350, 126)
      this.scene.start('gamePlay')
    })
    btn.on('pointerout', () => {
      btn.setTexture('btn')
      btn.setSize(150, 55)
      failedBtnText.setPosition(310, 111)
      btn.setPosition(350, 126)
    })
    this.needRenew = false
    window.ball = this.ball0
  },
  update () {
    if (this.isEnd) {
      return
    }
    const keyboard = this.input.keyboard.createCursorKeys()
    if ((this.needRenew) && this.level === 0) {
      console.log('run new')
      for (let i = 0; i < 6; i++) {
        this['ball' + i].y = -55
      }
      this.notMoveIndex = getRandom(5)
      this.needRenew = false
    } else if ((this.needRenew) && this.level === 1) {
      this.boss1.x = this.boss1Pos[getRandom(2, 0)]
      this.boss1.y = -400
      this.needRenew = false
    } else if ((this.needRenew) && this.level === 2) {
      this.boss2.x = this.boss2Pos[getRandom(1, 0)]
      this.boss2.y = -430
      this.needRenew = false
    }
    if (this['ball0'].visible) {
      let notThisStage = false
      for (let i = 0; i < 6; i++) {
        if (this['ball' + i].y > height + 55) {
          if (this.level > 0) {
            console.log('setVisible')
            notThisStage = true
            break
          }
          this.needRenew = true
        }
        if (this['ball' + i].y < -40 && this.level > 0) {
          notThisStage = true
          break
        }
        if (!(i < this.notMoveIndex + (2) && i > this.notMoveIndex - (2)) && !this.needRenew) {
          this['ball' + i].y += this.getStar ? 0 : this.normalSpeed
        }
      }
      if (notThisStage === true) {
        this.needRenew = true
        for (let i = 0; i < 6; i++) {
          this['ball' + i].setVisible(false)
          this['ball' + i].y = -110
        }
        if (this.level === 1) {
          this.boss1.setVisible(true)
        }
      }
    }
    if (this.boss1.visible) {
      this.boss1.y += this.getStar ? 0 : this.normalSpeed
      if (this.boss1.y >= height + 316 / 2) {
        this.needRenew = true
        if (this.level === 2) {
          console.log('level 2')
          this.boss1.setVisible(false)
          this.boss1.y = -200
          this.boss2.setVisible(true)
        }
      } else if (this.boss1.y < -316 / 2 && this.level === 2) {
        console.log('lovel up')
        this.boss1.setVisible(true)
        this.boss1.y = -200
        this.boss2.setVisible(true)
      }
    }
    if (this.boss2.visible) {
      this.boss2.y += this.getStar ? 0 : this.normalSpeed
      if (this.boss2.y >= height + 422 / 2) {
        this.needRenew = true
      }
    }
    if (this.startStar) {
      this.star.y += this.normalSpeed
      if (this.star.y > height + 55) {
        this.startStar = false
        this.star.y = -100
      }
    }

    this.bg.tilePositionY -= this.normalSpeed
    if (!this.getStar) {
      this.player.anims.play('run', true)
      this.player.setSize(110, 210)
    } else {
      this.player.anims.play('super', true)
      this.player.setSize(185, 210)
    }

    if (keyboard.right.isDown && this.player.x <= width - 215) {
      this.player.x += this.normalSpeed
    } else if (keyboard.left.isDown && this.player.x >= 215) {
      this.player.x -= this.normalSpeed
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
      debug: false
    }
  },
  scene: [
    gamePlay,
    gameFinish,
  ]
}

const game = new Phaser.Game(config)
