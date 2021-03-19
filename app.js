//*GLOBAL CONSTANTS BEGIN
const directions = {
  left: -2,
  up: -1,
  right: 2,
  down: 1,
}
//*GLOBAL CONSTANTS END

//*GLOBAL FUNCTIONS BEGIN
function searchSubarray(array, subArray) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][0] == subArray[0] && array[i][1] == subArray[1]) return true
  }
  return false
}
//*GLOBAL FUNCTIONS END

//*MAIN OBJECTS BEGIN
let field = {
  minX: 0,
  minY: 0,
  maxX: 21,
  maxY: 21,
  score: 0,
  scoreRate: 1,

  getMinX() {
    return this.minX
  },

  getMinY() {
    return this.minY
  },

  getMaxX() {
    return this.maxX
  },

  getMaxY() {
    return this.maxY
  },

  getScore() {
    return this.score
  },

  setScore(node, newScore = 0) {
    this.score = newScore
    node.textContent = this.score
  },

  addScore(node, countScore = 1) {
    this.score += countScore * document.querySelector('#speedInput').value
    if (this.score <= 0) this.score = 1
    node.textContent = this.score
  },

  render(snake, berry) {
    document.querySelectorAll('.point').forEach((item) => {
      item.classList.remove('snakeHead', 'snakeBody', 'berry')
    })
    snake.getPointsID().forEach((item, index) => {
      document
        .querySelector(item)
        .classList.add(`${index ? 'snakeBody' : 'snakeHead'}`)
    })
    document.querySelector(berry.getPointsID()).classList.add('berry')
    snake.setAllowToTurn(true)
  },

  gameOver() {
    const status = document.querySelector('.status')
    status.classList.add('status-gameover')
    status.textContent = 'Вы проиграли :('
    clearInterval(mainLoop)
  },

  init() {
    snake.reset()
    berry.getNewPosition()
    field.render(snake, berry)
    this.scoreRate = this.getSpeed()
  },

  getSpeed() {
    const speedInput = document.querySelector('#speedInput')
    return (100 - speedInput.value + 10) * 4
  },
}

let snake = {
  state: {
    body: [
      [11, 10],
      [12, 10],
    ],
    direction: [-1, 0],
    allowToTurn: true,
  },

  getPointsID() {
    return this.state.body.map(
      (item) =>
        '#pnt' +
        item.map((item) => (item < 10 ? '0' + item : +item.toString())).join('')
    )
  },

  makeStep(berry) {
    let nextHeadPosition = this.state.body[0].map(
      (number, index) => number + this.state.direction[index]
    )
    nextHeadPosition.forEach((item, index) => {
      let axis = index ? 'Y' : 'X'
      if (item < field[`getMin${axis}`]()) {
        nextHeadPosition[index] = field[`getMax${axis}`]() - 1
      } else if (item > field[`getMax${axis}`]() - 1) {
        nextHeadPosition[index] = field[`getMin${axis}`]()
      }
    })

    if (searchSubarray(this.state.body, nextHeadPosition)) {
      field.gameOver()
    } else {
      this.state.body.unshift(nextHeadPosition)
      if (nextHeadPosition.toString() == berry.position.toString()) {
        field.addScore($score)
        berry.getNewPosition(snake)
      } else {
        this.state.body.pop()
      }
    }
  },

  reset() {
    this.state.body = [
      [11, 10],
      [12, 10],
    ]
    this.changeDirection([-1, 0], true)
  },

  setAllowToTurn(bool) {
    this.state.allowToTurn = bool
  },

  getAllowToTurn() {
    return this.state.allowToTurn
  },

  changeDirection(direction, allowed) {
    this.allowToTurn = allowed
    this.state.direction = direction
  },

  turn(direction = 0) {
    //-2 - left, -1 - up, 2 - right, 1 - down
    if (this.state.direction[Math.abs(direction % 2)])
      this.changeDirection(
        [direction % 2, direction % 2 ? 0 : Math.sign(direction)],
        false
      )
  },
}

let berry = {
  position: [15, 10],

  getPointsID() {
    return (
      '#pnt' +
      this.position
        .map((item) => {
          return item < 10 ? '0' + item : item
        })
        .join('')
    )
  },

  generateNewPosition() {
    return ['X', 'Y'].map((item) => {
      return Math.floor(
        Math.random() * (field[`getMax${item}`]() - field[`getMin${item}`]()) +
          field[`getMin${item}`]()
      )
    })
  },

  getNewPosition() {
    let newPosition = this.generateNewPosition()
    while (searchSubarray(snake.state.body, newPosition)) {
      newPosition = this.generateNewPosition()
    }
    this.position = newPosition
  },
}

//*MAIN OBJECTS END

//*APPLICATION INIT BEGIN
let $score = document.querySelector('#score')

let $tickmarks = document.querySelector('#tickmarks')
for (let i = 0; i <= 10; i++) {
  if (!i) {
    $tickmarks.innerHTML += `<option value="0" label="Мин."></option>`
  } else if (i == 10) {
    $tickmarks.innerHTML += `<option value="100" label="Макс."></option>`
  } else {
    $tickmarks.innerHTML += `<option value="${i * 10}"></option>`
  }
}

let $field = document.querySelector('.field')
for (let i = field.getMinX(); i < field.getMaxX(); i++) {
  for (let j = field.getMinY(); j < field.getMaxY(); j++) {
    $field.innerHTML += `<div class="point" id="pnt${i < 10 ? '0' + i : i}${
      j < 10 ? '0' + j : j
    }"></div>`
  }
}

let $joystickForm = document.querySelector('#joystickForm')
;['up', 'left', 'right', 'down'].forEach((item) => {
  $joystickForm.innerHTML += `<button id="${item}Btn">&${item.slice(
    0,
    1
  )}arr;</button>`
})

field.init()

function mainLoopCB() {
  snake.makeStep(berry)
  field.render(snake, berry)
}

let mainLoop = setInterval(mainLoopCB, field.getSpeed())

;['up', 'down', 'left', 'right'].forEach((item) => {
  document.querySelector(`#${item}Btn`).addEventListener('click', (ev) => {
    ev.preventDefault()
    if (snake.getAllowToTurn()) {
      snake.setAllowToTurn(false)
      snake.turn(directions[item])
    }
  })
})

document.addEventListener('keydown', function (event) {
  if (event.key.slice(0, 5) == 'Arrow') {
    const key = event.key.slice(5).toLowerCase() // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    if (snake.getAllowToTurn()) {
      snake.setAllowToTurn(false)
      snake.turn(directions[key])
    }
  }
})

document.querySelector('#restartButton').addEventListener('click', (ev) => {
  ev.preventDefault()
  field.init()
  const status = document.querySelector('.status')
  status.classList.remove('status-gameover')
  status.textContent = 'Играем!'
  field.setScore($score)
  clearInterval(mainLoop)
  mainLoop = setInterval(mainLoopCB, field.getSpeed())
})

document.querySelector('#speedInput').addEventListener('change', (ev) => {
  ev.preventDefault()
  clearInterval(mainLoop)
  mainLoop = setInterval(mainLoopCB, field.getSpeed())
  ev.target.blur()
})

//*APPLICATION INIT END
