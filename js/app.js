import * as characters from './characters.js'

// constants

// variables
let selectedCharacter = null
let selectedBoss = null
let turn = null
let round = null

// cached element references
const bodyElement = document.querySelector('body')
const startContainer = document.querySelector('.start-container')
const gameContainter = document.querySelector('.game-container')
const mainMessage = document.querySelector('#main-message')
const gameMessage = document.querySelector('.game-message')
const startButton = document.querySelector('#start')
const selectButton = document.querySelector('#select')
const restartButton = document.querySelector('.restart')
const playerSelect = document.querySelector('.player-selection')
let activeCarItem = document.querySelector('.active')

init()
// event listeners --------
// start game
startButton.addEventListener("click", startClick)
// select character
selectButton.addEventListener("click", selectCharacter )

// functions --------
function init() {
  selectedCharacter = null
  round = 1
  gameMessage.innerText = `Match ${round}!`
  selectedBoss = characters.bossCharacters[0]
}

function startClick(evt) {
  mainMessage.innerText = 'Select Your Contestant'
  startButton.innerText = 'Step Into Arena'
  playerSelect.removeAttribute('hidden')
  selectButton.removeAttribute('hidden')
  startButton.hidden = true
}

function selectCharacter(evt) {
  activeCarItem = document.querySelector('.active')
  const charId = activeCarItem.id
  characters.playerCharacters.forEach((i) => {
    if (i.id === charId) {
      selectedCharacter = i
    }
  })
  startContainer.hidden = true
  gameContainter.removeAttribute('hidden')
  gameMessage.removeAttribute('hidden')
  bodyElement.style.flexDirection = 'column'
}