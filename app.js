let field = {
  minX: 0,
  minY: 0,
  maxX: 21,
  maxY: 21,

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

  render(snake, berry) {
    document.querySelectorAll('.point').forEach((item) => {
      item.classList.remove('snakeHead', 'snakeBody', 'berry')
    })
    snake.getPointsID().forEach((item, index) => {
      index
        ? document.querySelector(item).classList.add('snakeBody')
        : document.querySelector(item).classList.add('snakeHead')
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
  },

  getSpeed() {
    const speedInput = document.querySelector('#speedInput')
    return (100 - speedInput.value + 10) * 4
  },
}

function searchSubarray(array, subArray) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][0] == subArray[0] && array[i][1] == subArray[1]) return true
  }
  return false
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
    let nextHeadPosition = [
      this.state.body[0][0] + +this.state.direction[0],
      this.state.body[0][1] + +this.state.direction[1],
    ]

    if (nextHeadPosition[0] < field.getMinX()) {
      nextHeadPosition[0] = field.getMaxX() - 1
    } else if (nextHeadPosition[1] < field.getMinY()) {
      nextHeadPosition[1] = field.getMaxY() - 1
    } else if (nextHeadPosition[0] > field.getMaxX() - 1) {
      nextHeadPosition[0] = field.getMinX()
    } else if (nextHeadPosition[1] > field.getMaxY() - 1) {
      nextHeadPosition[1] = field.getMinY()
    }

    if (searchSubarray(this.state.body, nextHeadPosition)) {
      field.gameOver()
    } else if (nextHeadPosition.toString() == berry.position.toString()) {
      this.state.body.unshift(nextHeadPosition)
      berry.getNewPosition(snake)
    } else {
      this.state.body.unshift(nextHeadPosition)
      this.state.body.pop()
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

  turnLeft() {
    if (this.state.direction[0]) {
      this.changeDirection([0, -1], false)
    }
  },

  turnRight() {
    if (this.state.direction[0]) {
      this.changeDirection([0, 1], false)
    }
  },

  turnUp() {
    if (this.state.direction[1]) {
      this.changeDirection([-1, 0], false)
    }
  },

  turnDown() {
    if (this.state.direction[1]) {
      this.changeDirection([1, 0], false)
    }
  },
}

let berry = {
  position: [15, 10],

  getPointsID() {
    return (
      '#pnt' +
      (this.position[0] < 10
        ? '0' + this.position[0]
        : +this.position[0].toString()) +
      (this.position[1] < 10
        ? '0' + this.position[1]
        : +this.position[1].toString())
    )
  },

  generateNewPosition() {
    return [
      Math.floor(
        Math.random() * (field.getMaxX() - field.getMinX()) + field.getMinX()
      ),
      Math.floor(
        Math.random() * (field.getMaxY() - field.getMinY()) + field.getMinY()
      ),
    ]
  },

  getNewPosition() {
    let newPosition = this.generateNewPosition()
    while (searchSubarray(snake.state.body, newPosition)) {
      newPosition = this.generateNewPosition()
    }
    this.position = newPosition
  },
}

let $field = document.querySelector('.field')
for (let i = field.getMinX(); i < field.getMaxX(); i++) {
  for (let j = field.getMinY(); j < field.getMaxY(); j++) {
    $field.innerHTML += `<div class="point" id="pnt${i < 10 ? '0' + i : i}${
      j < 10 ? '0' + j : j
    }"></div>`
  }
}

field.init()

function mainLoopCB() {
  snake.makeStep(berry)
  field.render(snake, berry)
}

let mainLoop = setInterval(mainLoopCB, field.getSpeed())

let joystickButton = document.querySelector('#upBtn')
joystickButton.addEventListener('click', (ev) => {
  ev.preventDefault()
  if (snake.getAllowToTurn()) {
    snake.setAllowToTurn(false)
    snake.turnUp()
  }
})

joystickButton = document.querySelector('#downBtn')
joystickButton.addEventListener('click', (ev) => {
  ev.preventDefault()
  if (snake.getAllowToTurn()) {
    snake.setAllowToTurn(false)
    snake.turnDown()
  }
})

joystickButton = document.querySelector('#leftBtn')
joystickButton.addEventListener('click', (ev) => {
  ev.preventDefault()
  if (snake.getAllowToTurn()) {
    snake.setAllowToTurn(false)
    snake.turnLeft()
  }
})

joystickButton = document.querySelector('#rightBtn')
joystickButton.addEventListener('click', (ev) => {
  ev.preventDefault()
  if (snake.getAllowToTurn()) {
    snake.setAllowToTurn(false)
    snake.turnRight()
  }
})

document.addEventListener('keydown', function (event) {
  const key = event.key // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
  switch (event.key) {
    case 'ArrowLeft':
      // Left pressed
      if (snake.getAllowToTurn()) {
        snake.setAllowToTurn(false)
        snake.turnLeft()
      }
      break
    case 'ArrowRight':
      // Right pressed
      if (snake.getAllowToTurn()) {
        snake.setAllowToTurn(false)
        snake.turnRight()
      }
      break
    case 'ArrowUp':
      // Up pressed
      if (snake.getAllowToTurn()) {
        snake.setAllowToTurn(false)
        snake.turnUp()
      }
      break
    case 'ArrowDown':
      // Down pressed
      if (snake.getAllowToTurn()) {
        snake.setAllowToTurn(false)
        snake.turnDown()
      }
      break
  }
})

document.querySelector('#restartButton').addEventListener('click', (ev) => {
  ev.preventDefault()
  field.init()
  const status = document.querySelector('.status')
  status.classList.remove('status-gameover')
  status.textContent = 'Играем!'
  clearInterval(mainLoop)
  mainLoop = setInterval(mainLoopCB, field.getSpeed())
})

document.querySelector('#speedInput').addEventListener('change', (ev) => {
  ev.preventDefault()
  clearInterval(mainLoop)
  mainLoop = setInterval(mainLoopCB, field.getSpeed())
})
