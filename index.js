import { Game } from './modules/game.js'
import { View } from './modules/view.js'
import { Controller } from './modules/controller.js'

export const SIZE_BLOCK = 30
export const COLUMNS = 10
export const ROWS = COLUMNS * 2

const game = new Game()
const view = new View(document.querySelector('.container'))
const controller = new Controller(game, view)

controller.init('Enter')
