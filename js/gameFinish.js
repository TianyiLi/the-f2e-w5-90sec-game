/// <reference path="../node_modules/phaser/types/phaser.d.ts" />
/** @type {Phaser.Scene} */
const gameFinish = {
  key: 'gameFinish',
  preload () {
    this.load.image('goal', './assets/Goal.svg')
    this.load.spritesheet('duck', './assets/duck-sprite.svg')
    this.load.image('bg', '../assets/img_BG.svg')
  }
}
