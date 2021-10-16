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
const playerSelect = document.querySelector('.player-selection')
let activeCarItem = document.querySelector('.active')

init()
// event listeners
startButton.addEventListener("click", startClick)
selectButton.addEventListener("click", function(evt) {
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
  gameMessage.innerText = 'Match 1!'
  bodyElement.style.flexDirection = 'column'

})

// functions
function init() {
  selectedCharacter = null
}

function startClick(evt) {
  mainMessage.innerText = 'Select Your Contestant'
  startButton.innerText = 'Step Into Arena'
  playerSelect.removeAttribute('hidden')
  selectButton.removeAttribute('hidden')
  startButton.hidden = true
}