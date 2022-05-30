import { tetraminoes } from './tetraminoes.js'
import { COLUMNS, ROWS } from '../index.js'

const START_COLUMN = 3

export class Game {
  score = 0
  lines = 0
  level = 1
  record = localStorage.getItem('tetris-record') ?? 0
  points = [0, 100, 300, 700, 1500]
  gameOver = false

  area = [
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
  ]

  activeTetramino = this.createTetramino()
  nextTetramino = this.createTetramino()

  createTetramino() {
    const keys = Object.keys(tetraminoes)
    const letterTetramino = keys[Math.floor(Math.random() * keys.length)]
    const rotation = tetraminoes[letterTetramino]
    const rotationIndex = Math.floor(Math.random() * rotation.length)
    const block = rotation[rotationIndex]
    return {
      block,
      rotationIndex,
      rotation,
      x: START_COLUMN,
      y: 0,
    }
  }

  changeTetramino() {
    this.activeTetramino = this.nextTetramino
    this.nextTetramino = this.createTetramino()
  }

  moveLeft() {
    if (
      this.checkOutPosition(this.activeTetramino.x - 1, this.activeTetramino.y)
    ) {
      this.activeTetramino.x -= 1
    }
  }

  moveRight() {
    if (
      this.checkOutPosition(this.activeTetramino.x + 1, this.activeTetramino.y)
    ) {
      this.activeTetramino.x += 1
    }
  }

  moveDown() {
    if (this.gameOver) return
    if (
      this.checkOutPosition(this.activeTetramino.x, this.activeTetramino.y + 1)
    ) {
      this.activeTetramino.y += 1
    } else {
      this.stopMove()
    }
  }

  rotateTetramino() {
    this.activeTetramino.rotationIndex =
      this.activeTetramino.rotationIndex < 3
        ? this.activeTetramino.rotationIndex + 1
        : 0
    this.activeTetramino.block =
      this.activeTetramino.rotation[this.activeTetramino.rotationIndex]
    if (
      !this.checkOutPosition(this.activeTetramino.x, this.activeTetramino.y)
    ) {
      this.activeTetramino.rotationIndex =
        this.activeTetramino.rotationIndex > 0
          ? this.activeTetramino.rotationIndex - 1
          : 3
      this.activeTetramino.block =
        this.activeTetramino.rotation[this.activeTetramino.rotationIndex]
    }
  }

  get viewArea() {
    const area = JSON.parse(JSON.stringify(this.area))
    const { x, y, block } = this.activeTetramino
    for (let i = 0; i < block.length; i++) {
      const row = block[i]
      for (let j = 0; j < row.length; j++) {
        if (row[j] !== 'o') {
          area[y + i][x + j] = block[i][j]
        }
      }
    }
    return area
  }

  checkOutPosition(x, y) {
    const tetramino = this.activeTetramino.block
    for (let i = 0; i < tetramino.length; i++) {
      for (let j = 0; j < tetramino[i].length; j++) {
        if (tetramino[i][j] === 'o') {
          continue
        }
        if (
          !this.area[y + i] ||
          !this.area[y + i][x + j] ||
          this.area[y + i][x + j] !== 'o'
        ) {
          return false
        }
      }
    }
    return true
  }

  stopMove() {
    const { x, y, block } = this.activeTetramino

    for (let i = 0; i < block.length; i++) {
      const row = block[i]
      for (let j = 0; j < row.length; j++) {
        if (row[j] !== 'o') {
          this.area[y + i][x + j] = block[i][j]
        }
      }
    }
    this.changeTetramino()
    const countRow = this.clearRow()
    this.calcScore(countRow)
    this.updatePanels()
    this.gameOver = !this.checkOutPosition(
      this.activeTetramino.x,
      this.activeTetramino.y
    )
  }

  clearRow() {
    const rows = []

    for (let i = ROWS - 1; i >= 0; i--) {
      let blocksCount = 0
      for (let j = 0; j < COLUMNS; j++) {
        if (this.area[i][j] !== 'o') {
          blocksCount += 1
        }
      }
      if (!blocksCount) {
        break
      }
      if (blocksCount === COLUMNS) {
        rows.unshift(i)
      }
    }

    rows.forEach(row => {
      this.area.splice(row, 1)
      this.area.unshift(new Array(COLUMNS).fill('o'))
    })

    return rows.length
  }

  calcScore(lines) {
    this.score += this.points[lines]
    this.lines += lines
    this.level = Math.floor(this.lines / 10) + 1
    if (this.score > this.record) {
      this.record = this.score
      localStorage.setItem('tetris-record', this.score)
    }
  }

  createUpdatePanels(showScore, showNextTetramino) {
    showScore(this.lines, this.score, this.level, this.record)
    showNextTetramino(this.nextTetramino.block)

    this.updatePanels = () => {
      showScore(this.lines, this.score, this.level, this.record)
      showNextTetramino(this.nextTetramino.block)
    }
  }
}
