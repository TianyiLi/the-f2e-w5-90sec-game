/// <reference path="../node_modules/phaser/types/phaser.d.ts" />
/** @type {Phaser.Scene} */
const gameFinish = {
  key: 'gameFinish',
  preload () {
    this.load.image('goal', './assets/Goal.svg')
    this.load.spritesheet('duck', './assets/duck-sprite.png', { frameHeight: 230, frameWidth: 130 })
    this.load.image('bg', './assets/img_BG.svg')
    this.load.image('bg-top', './assets/img_frame.svg')
    this.load.image('clear1', './assets/img_clear01.svg')
    this.load.image('clear2', './assets/img_clear02.svg')
    this.load.image('clear3', './assets/img_clear03.svg')
    this.load.image('btn', './assets/btn_start_off.svg')
    this.load.image('btn-click', './assets/btn_start_off_click.svg')
  },
  create () {
    let bg = this.add.tileSprite(width / 2, height / 2 + 126, width, height, 'bg')
    let bgTop = this.add.tileSprite(width / 2, 131 / 2, width, 121, 'bg-top')
    let goal = this.add.tileSprite(width / 2, 131, 200, 200, 'goal')
    let duck = this.add.sprite(width / 2, height, 'duck')
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('duck', { start: 1, end: 3 }),
      frameRate: 5,
      repeat: -1
    })
    duck.anims.play('run')
    this.tweens.add({
      targets: duck,
      async onComplete () {
        console.log('end')
        await alphaShow(finishWrap)
        await alphaShow(clear1, 1000)
        await alphaShow(clear2, 1000)
        await alphaShow(clear3, 1000)
        await alphaShow(btnWrap, 1000)
      },
      duration: 3000,
      loop: 0,
      y: 330,
    })
    let finishWrap = this.add.container(250, 275)
    let btnWrap = this.add.container(275, 261)
    btnWrap.setSize(150, 55)
    btnWrap.setAlpha(0)
    finishWrap.setAlpha(0)
    let finishRect = this.add.graphics()
    finishRect.fillRoundedRect(0, 0, 700, 350, 30)
    finishRect.fillStyle(0xffffff, 1)
    let btn = this.add.tileSprite(75, 55/2, 150, 55, 'btn')
    let btnText = this.add.text(27, 10, '再來一次...', {
      color: 'white',
      fontSize: 20,
      fontFamily: 'Noto Sans TC',
      style: 'bold'
    })
    btn.setInteractive()
    btn.on('pointerdown', () => {
      btn.setTexture('btn-click')
      btn.setSize(150, 50)
      btn.setPosition(75, 60/2)
      btnText.setPosition(27, 15)
    })
    btn.on('pointerup', () => {
      btn.setTexture('btn')
      btn.setSize(150, 55)
      console.log('uppp')
      btnText.setPosition(27, 10)
      btn.setPosition(75, 55/2)
      this.scene.start('gamePlay')
    })
    btn.on('pointerout', () => {
      btn.setTexture('btn')
      btn.setSize(150, 55)
      btnText.setPosition(27, 10)
      btn.setPosition(75, 55/2)
    })
    btnWrap.add([btn, btnText])
    let clear1 = this.add.tileSprite(45 + ((700 - 90) / 3 / 2), 78 + 190 / 2, 190, 155, 'clear1')
    let clear2 = this.add.tileSprite(700 / 2, 78 + 190 / 2, 190, 155, 'clear2')
    let clear3 = this.add.tileSprite(700 - 45 - 190 / 2, 78 + 190 / 2, 190, 155, 'clear3')
    clear1.setAlpha(0)
    clear2.setAlpha(0)
    clear3.setAlpha(0)
    const alphaShow = (obj, time = 500) => {
      return new Promise((res) => {
        this.tweens.add({
          targets: obj,
          onComplete: res,
          duration: time,
          loop: 0,
          ease: 'linear',
          yoyo: false,
          alpha: {
            getStart: () => 0,
            getEnd: () => 1
          }
        })
      })
    }

    let finishTitle = this.add.text(161, 22, 'Congratulations! 恭喜過關!', {
      color: '#ff952b',
      fontSize: 30,
      fontFamily: 'Noto Sans TC',
      style: 'bold'
    })

    finishWrap.setSize(700, 350)
    finishWrap.add([finishRect, finishTitle, clear1, clear2, clear3, btnWrap])
  }
}
