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
let roundWinner = null
let turnHappening = false
let playerMoved = null
let firstPlayer = ''
let secondPlayer = ''

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
const continueButton = document.querySelector('#continue')
const playOptions = document.querySelector('.play-options')
const buttons = [standardButton,defenseButton,specialButton, ultButton]

// initialize the game ------
init()

// event listeners --------
// start game
startButton.addEventListener("click", startClick)
// select character
selectButton.addEventListener("click", selectCharacter )
// attack listener
playOptions.addEventListener("click", function(evt){
  let buttonClicked = evt.target
  moveId = buttonClicked.id
  if (buttonClicked.classList.contains('btn-success') && turnHappening === false && roundWinner === false) {
    // determine boss move
    selectBossMove()
    useTurnOrder()
    console.log(firstPlayer)
    console.log(secondPlayer)
    gameText.innerText = `You chose ${buttonClicked.innerText}`
    turnHappening = true
    continueButton.removeAttribute('hidden')
  }
  else if ((buttonClicked.classList.contains('btn-secondary')  && turnHappening === false ) ) {
    gameText.innerText = 'You do not have enough AP for magic of that caliber!'
  }
})

continueButton.addEventListener("click", function(evt){
  if (turnHappening === true && roundWinner === false) {
    playGame()
    console.log(playerMoved)
    getRoundWinner()
    if (playerMoved === 1 || roundWinner === true) {
      turnOver()
    }
  }
})



// functions --------
function init() {
  selectedCharacter = null
  round = 1
  turn = 1
  turnText = `${turn}/10`
  selectedBoss = characters.bossCharacters[0]
  // sprite.innerText = selectedBoss.name
  roundWinner = false
  playerMoved = 1
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
  gameMessage.innerText = `Match ${round}! ${selectedCharacter.name}  vs ${selectedBoss.name}`
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
    if (enemy.shield === true) {
      enemy.shield = false
      gameText.innerText = `${enemy.name}'s defenses absorb the the effect of ${char.specialAttack.name}.`
    }
    else {
      char.currentAp -= char.specialAttack.apCost
      char.specialAttack.effect(enemy)
      gameText.innerText = `${char.specialAttack.description}`
    }
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
  if (turn < 4 || selectedBoss.ultimateUsed === true) {
    indexNum = Math.floor(Math.random() * (2 + 1))
  }
  else  {
    indexNum = Math.floor(Math.random() * (3 - 0 + 1))
    if (indexNum = 3) {
      selectedBoss.ultimateUsed = true
    }
  }
  bossMoveId = moveOptions[indexNum]
}

function selectBossMove() {
  selectBossIndex()
  while (selectedBoss[moveNames[moveOptions.indexOf(bossMoveId)]].apCost > selectedBoss.currentAp) {
    selectBossIndex()
  }

}

// this function will determine the turn order based on moveId and run both render turn functions in proper order
function turnOrder() {

  if (moveId === 'standard-att' && ['special-att', 'ultimate', 'standard-att'].includes(bossMoveId)) {
    turnOrderNum = 1
    console.log('your standard attack will go first')
  }
  else if (moveId === 'special-att' && ['ultimate'].includes(bossMoveId)) {
    turnOrderNum = 1
    console.log('your special will go first')
  }
  else if (moveId === 'defense') {
    turnOrderNum = 1
    console.log('your defense will go first')
  }
  else if (moveId === 'ultimate'  && ['ultimate'].includes(bossMoveId)) {
    turnOrderNum = 1
    console.log('your ult will go first')
  }
  else {
    turnOrderNum = 0
    console.log(`your ${moveId} will go second`)
  }
}

function useTurnOrder() {
  turnOrder()
  if (turnOrderNum === 1) {
    firstPlayer = 'player'
    secondPlayer = 'boss'
}
  else if (turnOrderNum === 0) {
    firstPlayer = 'boss'
    secondPlayer = 'player'
}}


function playGame() {
  if (roundWinner === false) {
    if (selectedCharacter.ableToMove === false && selectedBoss.ableToMove === false) {
      gameText.innerText = `Neither of you can move!`
      selectedCharacter.ableToMove = true
      selectedBoss.ableToMove = true
      playerMoved = 1
    }

    else if (selectedCharacter.ableToMove === false && playerMoved === 1) {
      gameText.innerText = `You cannot move due to ${selectedBoss.specialAttack.name}`
      playerMoved = 0
    }

    else if (selectedCharacter.ableToMove === false && playerMoved === 0) {
      renderBossMove()
      selectedCharacter.ableToMove = true
      playerMoved = 1
    }

    else if (selectedBoss.ableToMove === false && playerMoved === 1) {
      gameText.innerText = `${selectedBoss.name} cannot move due to ${selectedCharacter.specialAttack.name}`
      playerMoved = 0
    }
    else if (selectedBoss.ableToMove === false && playerMoved === 0) {
      renderPlayerMove()
      selectedBoss.ableToMove = true
      playerMoved = 1
    }
    else if (playerMoved === 1) {
      if (firstPlayer === 'player') {
        console.log('rendering player move first')
        renderPlayerMove()
      }
      else {
        console.log('rendering boss move first')
        renderBossMove()
      }
      playerMoved = 0
    }

    else if (playerMoved === 0) {
      if (firstPlayer === 'player') {
        console.log('rendering boss move second')
        console.log(bossMoveId)
        renderBossMove()
        playerMoved = 1
      }
      else {
        console.log('rendering player move second')
        console.log(moveId)
        renderPlayerMove()
        playerMoved = 1
      }
    }
  }
    
}

  function getRoundWinner() {
    if (selectedCharacter.currentHp <= 0) {
      gameText.innerText = `The ${selectedBoss.name} is victorious! Try again the next tourney!`
      roundWinner = true
    }
    else if (selectedBoss.currentHp <= 0) {
      gameText.innerText = `The ${selectedCharacter.name} prevails, defeating ${selectedBoss.name}`
      roundWinner = true

    }
    else if (turn >= 10) {
      if (selectedCharacter.currentHp > selectedBoss.currentHp) {
        gameText.innerText = `After 10 rounds, the ${selectedCharacter.name} prevails! The contestant with the highest HP moves to the next round!`
        roundWinner = true

      }
      else {
        gameText.innerText = `After 10 round, the ${selectedBoss.name} is victorious! Try again the next tourney!`
        roundWinner = true
      }
    }
}

function turnOver() {
  console.log('turn over')
  turnHappening = false
  selectedCharacter.currentAp += 1
  selectedBoss.currentAp += 1
  continueButton.hidden = true
  turn += 1
}

