const playerCharacters = [
  {
    id: 'mage',
    name: 'Mage',
    maxHp: 100,
    currentHp: 100,
    currentAp: 2,
    ableToMove: true,
    damageNull: false,
    shield: false,
    standardAttack: {
      name: 'Magic Missle',
      apCost: 0,
      damage: 15,
      description: 'You send a focused beam of arcane energy across the arena'
    },
    defense: {
      name: 'Thunder Ward',
      apCost: 1,
      damageReduction: 1,
      description: 'You cloak yourself in a ward of sparks, protecting yourself from the next attack'
    },
    specialAttack: {
      name: 'Ray of Frost',
      effect: function(char) {
        char.ableToMove = false
      },
      apCost: 2,
      description: 'You generate an itense blast of freezing air, stopping your foe in their tracks. They cannot move next turn.'
    },
    ultimate: {
      name: 'Meteor',
      apCost: 4,
      damage: 35,
      description: 'You focus all of your arcane strength and conjur a massive meteor from the aether. You send it hurling towards your opponent'
    }
  }
]
const bossCharacters = [
  {
    id: 'litch',
    name: 'Mitch the Litch',
    maxHp: 100,
    currentHp: 15,
    currentAp: 2,
    ableToMove: true,
    damageNull: false,
    shield: false,
    ultimateUsed: false,
    standardAttack: {
      id: 'standard-att',
      name: 'Finger of Death',
      apCost: 0,
      damage: 15,
      description: 'Mitch the Litch extends a bony finger and fires a bolt of deadly energy towards you'
    },
    defense: {
      id: 'defense',
      name: 'Shield',
      apCost: 1,
      damageReduction: 1,
      description: 'Your foe summons forth a pulsating shield of energy to protect them from your next attack'
    },
    specialAttack: {
      id: 'special-att',
      name: 'Paralyzing Gaze',
      effect: function(char) {
        char.ableToMove = false
      },
      apCost: 2,
      description: 'The litch locks eyes with you and you feel your soul grow cold. You are unable to move next turn.'
    },
    ultimate: {
      id: 'ultimate',
      name: 'Psychic Scream',
      ap: 0,
      damage: 50,
      description: 'The undead sorcerer unhinges his boney jaw in a silent scream. Though not audible, the scream tears at your mind'
    }
  }
]
// console.log(playerCharacters[0].currentAp)

export {playerCharacters, bossCharacters}