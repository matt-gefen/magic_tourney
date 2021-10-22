// import external objects
import * as characters from './characters.js'

// constants
const moveOptions = ['standard-att', 'defense', 'special-att','ultimate']
const moveNames = ['standardAttack', 'defense', 'specialAttack', 'ultimate']

// variables
let selectedCharacter = {}
let selectedBoss = {}
let turn = null
let turnText = null
let turnOrderNum = null
let moveId = null
let bossMoveId = null
let reducedDamage = null
let roundWinner = null
let turnHappening = false
let playerMoved = null
let firstPlayer = ''
let secondPlayer = ''
let mode = 'dark'

// cached element references ------

const bodyElement = document.querySelector('body')
const startContainer = document.querySelector('.start-container')
const mainMessage = document.querySelector('#main-message')
const startButton = document.querySelector('#start')
const charName = document.querySelector('.character-name')
const rulesButton = document.querySelector('#rules-button')
const selectButton = document.querySelector('#select')
const restartBox = document.querySelector('.restart')
const resetButton = document.querySelector('#restart-button')
const playerSelect = document.querySelector('.player-selection')
let activeCarItem = document.querySelector('.active')
const mainAudio = document.getElementById("audio-play")
const gameTop = document.querySelector('.game-top')
const topButtons = document.querySelector('.top-buttons')
const gameBottom = document.querySelector('.game-bottom')
const gameMessage = document.querySelector('.game-message')
const gameContainter = document.querySelector('.game-container')
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
const gameInfo = document.querySelector('.game-info')
const buttons = [standardButton,defenseButton,specialButton, ultButton]
const buttonList = document.querySelectorAll('button')
const modeButton = document.querySelector('#dark-mode-game')

// initialize the game ------
init()

// event listeners --------
startButton.addEventListener("click", startClick)

selectButton.addEventListener("click", selectCharacter )

modeButton.addEventListener("click", function(evt){
  if (mode === 'dark' ) {
    setLightMode()
  }
else if (mode==='light'){
  setDarkMode()
    }
  }
)

playOptions.addEventListener("click", function(evt){
  let buttonClicked = evt.target
  if (buttonClicked.classList.contains('btn-success') && turnHappening === false && roundWinner === false) {
    moveId = buttonClicked.id
    selectBossMove()
    useTurnOrder()
    gameText.innerText = `You chose ${buttonClicked.innerText}`
    turnHappening = true
    continueButton.removeAttribute('hidden')
    buttonList.forEach((i) => {
      if (moveOptions.includes(i.id)) {
        i.disabled = true
      }
    })
  }
  else if ((buttonClicked.classList.contains('btn-secondary')  && turnHappening === false ) ) {
    gameText.innerText = 'You do not have enough AP for magic of that caliber!'
  }
})

continueButton.addEventListener("click", nextButtonClick)

resetButton.addEventListener('click', init)

// functions --------
function init() {
  mainAudio.volume = 0.4; 
  mainAudio.src = "./audio/ambiance_1.mp3"
  selectedCharacter = {}
  turn = 1
  turnText = `${turn}/10`
  Object.assign(selectedBoss,characters.bossCharacters[0])
  // something here is broken, the boss damage is being overwritten by their special attacks from prev rounds. Same goes for PC. 
  selectedBoss.standardAttack.damage = 15
  roundWinner = false
  playerMoved = 1
  mainMessage.innerText = 'Welcome to Magic Tourney'
  gameText.innerText = 'The Battle Begins!'
  startButton.innerText = 'Start The Game'
  playerSelect.hidden = true
  selectButton.hidden = true
  startContainer.hidden = false
  startButton.hidden = false
  restartBox.hidden = true
  gameContainter.hidden = true
  gameMessage.hidden = true
  bodyElement.style.flexDirection = 'row'
  gameTop.hidden = true
  topButtons.hidden = true
  gameBottom.hidden = true
  rulesButton.hidden = false
  charName.hidden = true
  gameInfo.hidden = false
  playOptions.hidden = false
  mode = 'dark'
}

function startClick() {
  mainMessage.innerText = 'Select Your Contestant'
  playerSelect.removeAttribute('hidden')
  selectButton.removeAttribute('hidden')
  startButton.hidden = true
  rulesButton.hidden = true
  charName.hidden = false
}

function selectCharacter() {
  activeCarItem = document.querySelector('.active')
  const charId = activeCarItem.id
  characters.playerCharacters.forEach((i) => {
    if (i.id === charId) {
      Object.assign(selectedCharacter,i)
    }
  })
  selectedCharacter.standardAttack.damage = 15
  startContainer.hidden = true
  gameContainter.removeAttribute('hidden')
  gameMessage.removeAttribute('hidden')
  gameTop.removeAttribute('hidden')
  topButtons.removeAttribute('hidden')
  gameBottom.removeAttribute('hidden')
  bodyElement.style.flexDirection = 'column'
  mainAudio.src = './audio/battle_2.mp3'
  restartBox.hidden = false
  gameInfo.hidden = false
  gameText.style.fontSize = '3vh'
  renderGame()
}

function renderGame() {
  gameMessage.innerText = `${selectedCharacter.name}  vs ${selectedBoss.name}`
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
  if (mode === 'light') {
    setLightMode()
  }
  else {
    setDarkMode()
  }

}

function renderMove(char, enemy, moveId) {
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
      char.specialAttack.effect(char)
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
    turnOrderNum = 0
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
    if (playerMoved === 1) {
      if (firstPlayer === 'player') {
        renderPlayerMove()
      }
      else {
        renderBossMove()
      }
      playerMoved = 0
    }

    else if (playerMoved === 0) {
      if (firstPlayer === 'player') {
        renderBossMove()
        playerMoved = 1
        turnHappening = false
      }
      else {
        renderPlayerMove()
        playerMoved = 1
        turnHappening = false
      }
    }
  }
    
}

  function getRoundWinner() {
    if (selectedCharacter.currentHp <= 0) {
      gameText.innerText = `The ${selectedBoss.name} is victorious! Try again in the next tourney!`
      roundWinner = true
      playOptions.hidden = true
      gameInfo.hidden = true
      mainAudio.src = "./audio/you-lose.mp3"
    }
    else if (selectedBoss.currentHp <= 0) {
      gameText.innerText = `The ${selectedCharacter.name} prevails, defeating ${selectedBoss.name}`
      roundWinner = true
      playOptions.hidden = true
      gameInfo.hidden = true
      mainAudio.src = "./audio/victory.mp3"

    }
    else if (turn > 10) {
      if (selectedCharacter.currentHp > selectedBoss.currentHp) {
        gameText.innerText = `After 10 rounds, the ${selectedCharacter.name} prevails! The contestant with the highest HP wins!`
        roundWinner = true
        playOptions.hidden = true
        gameInfo.hidden = true
        mainAudio.src = "./audio/victory.mp3"
        
      }
      else if (selectedCharacter.currentHp < selectedBoss.currentHp) {
        gameText.innerText = `After 10 rounds, the ${selectedBoss.name} is victorious! Try again in the next tourney!`
        playOptions.hidden = true
        roundWinner = true
        gameInfo.hidden = true
        mainAudio.src = "./audio/you-lose.mp3"
      }
      else {
        gameText.innerText = `It's a tie! By the rules of Magic Tourney, nobody wins!`
        playOptions.hidden = true
        gameInfo.hidden = true
        roundWinner = true
        mainAudio.src = "./audio/you-lose.mp3"
      }
    }
}

function turnOver() {
  buttonList.forEach((i) => {
    i.disabled = false
  })
  turnHappening = false
  gameText.innerText = `Select Your Move`
  selectedCharacter.currentAp += 1
  selectedBoss.currentAp += 1
  continueButton.hidden = true
  getRoundWinner()
  if (roundWinner === false) {
    turn += 1
  }
  renderGame()
}

function nextButtonClick(){
  getRoundWinner()
  if (roundWinner === true) {
    turnHappening = false
  }
  else if (roundWinner === false && turnHappening === true) {
    playGame()
  }
  else if (roundWinner === false && turnHappening === false) {
      turnOver()
      getRoundWinner()
    }
  }

  function setLightMode() {
    bodyElement.style.background = 'url(/images/fajrbackground.png)'
    bodyElement.style.backgroundRepeat = 'no-repeat'
    bodyElement.style.backgroundSize = 'cover'
    bodyElement.style.color = 'black'
    gameContainter.style.color = 'black'
    gameMessage.style.color = 'black'
    buttonList.forEach((i) => {
      if (moveOptions.includes(i.id) && i.classList.contains('btn-success')) {
        i.style.backgroundColor = '#ffc43d'
      }

      else if (moveOptions.includes(i.id) && i.classList.contains('btn-secondary')) {
        i.style.backgroundColor = '#6c757d'
      }
    })
    mode = 'light'

    }
    
    function setDarkMode() {
      bodyElement.style.background = 'url(/images/particles.gif)'
      bodyElement.style.backgroundRepeat = ''
      bodyElement.style.backgroundSize = ''
      bodyElement.style.color = 'white'
      gameContainter.style.color = 'white'
      gameMessage.style.color = 'white'
      buttonList.forEach((i) => {
        if (moveOptions.includes(i.id) && i.classList.contains('btn-success')) {
          i.style.backgroundColor = 'rgb(179, 20, 20)'
        }
  
        else if (moveOptions.includes(i.id) && i.classList.contains('btn-secondary')) {
          i.style.backgroundColor = '#6c757d'
        }
      })
      mode = 'dark'
    }