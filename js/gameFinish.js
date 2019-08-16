/// <reference path="../node_modules/phaser/types/phaser.d.ts" />
/** @type {Phaser.Scene} */
const gameFinish = {
  key: 'gameFinish',
  preload () {
    this.load.image('goal', './assets/Goal.svg')
    this.load.spritesheet('duck', './assets/duck-sprite.png', { frameHeight: 230, frameWidth: 130 })
    this.load.image('bg', './assets/img_BG.svg')
    this.load.image('bg-top', './assets/img_frame.svg')
  },
  create () {
    let bg = this.add.tileSprite(width / 2, height / 2 + 126, width, height, 'bg')
    let bgTop = this.add.tileSprite(width / 2, 131 / 2, width, 121, 'bg-top')
    let goal = this.add.tileSprite(width / 2, 100, 200, 200, 'goal')
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
      onComplete () { console.log('end') },
      duration: 3000,
      loop: 0,
      offset: [
        {
          targets: duck,
          y: 330,
          loop: 0,
          ease: 'Linear',
          duration: 3000
        }
      ]
    })
  }
}
