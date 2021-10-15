import * as characters from './characters.js'

init()

// constants

// variables
let selectedCharacter = null
let selectedBoss = null
let turn = null
let round = null

// cached element references
const mainContainer = document.querySelector('.container')
const mainMessage = document.querySelector('#main-message')
const startButton = document.querySelector('#start')
const playerSelect = document.querySelector('.player-selection')


// event listeners
startButton.addEventListener("click", function(evt) {
  mainMessage.innerText = 'Select Your Contestant'
  startButton.innerText = 'Step Into Arena'
  playerSelect.removeAttribute('hidden')

})

console.log(characters.playerCharacters)

// functions
function init() {
  return
}