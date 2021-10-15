const playerCharaceters = [
  {
    name: 'Mage',
    maxHp: 100,
    maxAp: 4,
    currentHp: this.maxHp,
    currentAp: this.maxAp,
    ableToMove: true,
    standardAttack: {
      name: 'Magic Missle',
      damage: 15,
      description: 'You send a focused beam of arcane energy across the arena'
    },
    defense: {
      name: 'Thunder Ward',
      damageReduction: 1,
      description: 'You cloak yourself in a ward of sparks, protecting yourself from the next attack'
    },
    specialAttack: {
      name: 'Ray of Frost',
      // effect: ableToMove for boss char set = false
      description: 'You generate an itense blast of freezing air, stopping your foe in their tracks.'
    },
    ultimate: {
      name: 'Meteor',
      damage: 35,
      description: 'You focus all of your arcane strength and conjur a massive meteor from the aether. You send it hurling towards your opponent.'
    }
  }
]