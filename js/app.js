import * as characters from './characters.js'

// constants

// variables
let selectedCharacter = null
let selectedBoss = null
let turn = null
let turnText = null
let round = null
let moveId = null
let bossMoveId = null

// cached element references ------
// start and character select
const bodyElement = document.querySelector('body')
const startContainer = document.querySelector('.start-container')
const mainMessage = document.querySelector('#main-message')
const startButton = document.querySelector('#start')
const selectButton = document.querySelector('#select')
// const restartButton = document.querySelector('.restart')
const playerSelect = document.querySelector('.player-selection')
let activeCarItem = document.querySelector('.active')

// main game elements
const gameMessage = document.querySelector('.game-message')
const gameContainter = document.querySelector('.game-container')
const sprite = document.querySelector('.sprite')
const gameText = document.querySelector('.game-text')
const healthNumber = document.querySelector('#health-number')
const apNumber = document.querySelector('#ap-number')
const bossHealthNumber = document.querySelector('#boss-health-number')
const turnNumber = document.querySelector('#turn-number')
const standardButton = document.querySelector('#standard-att')
const defenseButton = document.querySelector('#defense')
const specialButton = document.querySelector('#special-att')
const ultButton = document.querySelector('#ultimate')

// initialize the game --
init()


// event listeners --------
// start game
startButton.addEventListener("click", startClick)
// select character
selectButton.addEventListener("click", selectCharacter )
// attack listener
gameContainter.addEventListener("click", function(evt){
  let buttonClicked = evt.target
  moveId = buttonClicked.id
  console.log(moveId)
  if (buttonClicked.classList.contains('btn')) {
    // determine boss move
    // determine order - conditional render move
    // render playerMove
    renderPlayerMove()
    // renderBossMove()
  }
})


// functions --------
function init() {
  selectedCharacter = null
  round = 1
  turn = 1
  turnText = `${turn}/10`
  gameMessage.innerText = `Match ${round}!`
  selectedBoss = characters.bossCharacters[0]
  sprite.innerText = selectedBoss.name
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
  renderGame()
}

function renderGame() {
  healthNumber.innerText = selectedCharacter.currentHp
  apNumber.innerText = selectedCharacter.currentAp
  bossHealthNumber.innerText = selectedBoss.currentHp
  turnNumber.innerText = turnText
  standardButton.innerText = selectedCharacter.standardAttack.name
  defenseButton.innerText = selectedCharacter.defense.name
  specialButton.innerText = selectedCharacter.specialAttack.name
  ultButton.innerText = selectedCharacter.ultimate.name
}

function renderMove(char, enemy, moveId) {
  // needs to add in AP cost
  if (moveId === 'standard-att') {
    if (enemy.shield === true) {
      enemy.shield = false
      let reducedDamage = char.standardAttack.damage - (char.standardAttack.damage * enemy.defense.damageReduction)
      enemy.currentHp -= reducedDamage
      gameText.innerText = `${char.standardAttack.description}. Defences reduce the impact to ${reducedDamage} damage.`

    }
    else {
      enemy.currentHp -= char.standardAttack.damage
      gameText.innerText = `${char.standardAttack.description} dealing ${char.standardAttack.damage} damage.`
    }
    bossHealthNumber.innerText = enemy.currentHp
  }

  else if (moveId === 'defense') {
    char.shield = true
    gameText.innerText = `${char.defense.description}`
  }

  else if (moveId === 'special-att') {
    char.specialAttack.effect(enemy)
    gameText.innerText = `${char.specialAttack.description}`
  }
  else if (moveId === 'ultimate') {
    if (enemy.shield === true) {
      enemy.shield = false
      enemy.currentHp -= char.ultimate.damage - (char.ultimate.damage * enemy.defense.damageReduction)
      gameText.innerText = `${char.ultimate.description}. Defences reduce the impact to ${char.ultimate.damage} damage.`
    }
    else {
      enemy.currentHp -= char.ultimate.damage
      gameText.innerText = `${char.ultimate.description} dealing ${char.ultimate.damage} damage.`
    }
    bossHealthNumber.innerText = enemy.currentHp
  }
}

function renderPlayerMove() {
  renderMove(selectedCharacter,selectedBoss,moveId)
}

function renderBossMove() {
  // replace moveId with the select Boss move function
  renderMove(selectedBoss,selectedCharacter,moveId)
}