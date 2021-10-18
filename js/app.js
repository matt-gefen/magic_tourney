import * as characters from './characters.js'

// constants
const moveOptions = ['standard-att', 'defense', 'special-att','ultimate']
const moveNames = ['standardAttack', 'defense', 'specialAttack', 'ultimate']
// variables
let selectedCharacter = null
let selectedBoss = null
let turn = null
let turnText = null
let turnOrderNum = null
let round = null
let moveId = null
let bossMoveId = null
let reducedDamage = null

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
const buttons = [standardButton,defenseButton,specialButton, ultButton]

// initialize the game ------
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
  if (buttonClicked.classList.contains('btn-success')) {
    // determine boss move
    // determine order - conditional render move
    // render playerMove
    playGame()
  }
  else if ((buttonClicked.classList.contains('btn-secondary')) ) {
    gameText.innerText = 'You do not have enough AP for magic of that caliber!'
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
  turnText = `${turn}/10`
  turnNumber.innerText = turnText
  standardButton.innerText = selectedCharacter.standardAttack.name
  defenseButton.innerText = selectedCharacter.defense.name
  specialButton.innerText = selectedCharacter.specialAttack.name
  ultButton.innerText = selectedCharacter.ultimate.name
  moveNames.forEach((i, idx) => {
    if (selectedCharacter[i].apCost > selectedCharacter.currentAp) {
      buttons[idx].classList.remove('btn-success')
      buttons[idx].classList.add('btn-secondary')
    }
    else if (selectedCharacter[i].apCost <= selectedCharacter.currentAp && buttons[idx].classList.contains('btn-secondary')) {
      buttons[idx].classList.remove('btn-secondary')
      buttons[idx].classList.add('btn-success')
    }

  })

}

function renderMove(char, enemy, moveId) {
  // needs to add in AP cost
  if (moveId === 'standard-att') {
    char.currentAp -= char.standardAttack.apCost
    if (enemy.shield === true) {
      enemy.shield = false
      reducedDamage = char.standardAttack.damage - (char.standardAttack.damage * enemy.defense.damageReduction)
      enemy.currentHp -= reducedDamage
      gameText.innerText = `${char.standardAttack.description}. Defences reduce the impact to ${reducedDamage} damage.`

    }
    else {
      enemy.currentHp -= char.standardAttack.damage
      gameText.innerText = `${char.standardAttack.description} dealing ${char.standardAttack.damage} damage.`
    }
    renderGame()
  }

  else if (moveId === 'defense') {
    char.currentAp -= char.defense.apCost
    char.shield = true
    gameText.innerText = `${char.defense.description}`
    renderGame()
  }

  else if (moveId === 'special-att') {
    char.currentAp -= char.specialAttack.apCost
    char.specialAttack.effect(enemy)
    gameText.innerText = `${char.specialAttack.description}`
    renderGame()
  }
  else if (moveId === 'ultimate') {
    char.currentAp -= char.ultimate.apCost
    if (enemy.shield === true) {
      enemy.shield = false
      reducedDamage = char.ultimate.damage - (char.ultimate.damage * enemy.defense.damageReduction)
      enemy.currentHp -= reducedDamage
      gameText.innerText = `${char.ultimate.description}. Defences reduce the impact to ${reducedDamage} damage.`
    }
    else {
      enemy.currentHp -= char.ultimate.damage
      gameText.innerText = `${char.ultimate.description} dealing ${char.ultimate.damage} damage.`
    }
    renderGame()

  }
}

function renderPlayerMove() {
  renderMove(selectedCharacter,selectedBoss,moveId)
}

function renderBossMove() {
  // replace moveId with the select Boss move function
  renderMove(selectedBoss,selectedCharacter,bossMoveId)
  if (moveId === 'ultimate') {
    selectedBoss.currentAp *= 0
    selectedBoss.ultimateUsed = true
  }
}

function selectBossIndex() {
  let indexNum = 0
  if (turn <= 4 || selectedBoss.ultimateUsed === true) {
    indexNum = Math.floor(Math.random() * (2 + 1))
  }
  else  {
    indexNum = Math.floor(Math.random() * (3 - 0 + 1))
  }
  bossMoveId = moveOptions[indexNum]
}

function selectBossMove() {
  // while selectedBoss[moveNames[moveOptions.indexOf(bossMoveId)]]
  selectBossIndex()
  while (selectedBoss[moveNames[moveOptions.indexOf(bossMoveId)]].apCost > selectedBoss.currentAp) {
    selectBossIndex()
  }

}

// this function will determine the turn order based on moveId and run both render turn functions in proper order
function turnOrder() {
  if (moveId === 'standard-att' && ['special-att', 'ultimate', 'standard-att'].includes(bossMoveId)) {
    turnOrderNum = 1
  }
  else if (moveId === 'special-att' && ['ultimate'].includes(bossMoveId)) {
    turnOrderNum = 1
  }
  else if (moveId === 'defense') {
    turnOrderNum = 1
  }
  else if (moveId === 'ultimate'  && ['ultimate'].includes(bossMoveId)) {
    turnOrderNum = 1
  }
  else {
    turnOrderNum = 2
  }
}

function playGame() {
  selectBossMove()
  turnOrder()
  if (turnOrderNum === 1) {
    renderPlayerMove()
    setTimeout(renderBossMove, 3000)
  }
  else {
    renderBossMove()
    setTimeout(renderPlayerMove, 3000)
  }
  turn += 1
  selectedCharacter.currentAp += 1
  selectedBoss.currentAp += 1
}