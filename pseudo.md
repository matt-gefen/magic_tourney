1. Set up framework using GA's game-dev commented sections
2. Create Game Start + Player Select Screen
  2.1 Game Start
    <!-- 2.1.1. Create container grid item for all in-game components -->
      <!-- - initial start screen will actually be a flex item; will change to grid after character select. -->
      <!-- - container should initialize with static intro message and start button -->
    <!-- 2.1.2. Save container and start button as js variables -->
    <!-- 2.1.3. Initialize event listener for button click -->
      <!-- - on button click; shift to the character select screen -->
        <!-- Change message -->
        <!-- Add character carosel (bootstrap) -->
        <!-- Change button from start the game to - Step into Arena -->
    2.1.4 Create init function that holds this state
  2.2 Character Select 
    2.2.1. Create player-characters file
      2.2.2. Create objects for each playable character (mage, warlock, cleric) that stores:
        - max-hp
        - max-ap
        - current-hp
        - current-ap
        - standard-attack (this may need to be a sub-object)
          - name
          - damage
        - shield
          - damage reduced
          - additional effect #
        - special 
          - damage
          - additional effect 
        - ultimate
          - # rounds to charge
          - damage
          - additional effect

What are the functions that relate to each character?
- Seems like I need a deal damage function
 - useStandardAttack
   - determine damage
   - subtract damage from enemy
 - useDefense
 - useSpecial
   - basically the same as useUltimate
 - useUltimate
   - Determine damage
   - subtract damage from enemy
   - Determine buff
   - enact buff
   - Determine heal
   - enact heal

      2.2.3. Create div/button that represents a character selection option in the main container
        <!-- - Styling thought - this could be done with a bootstrap caurosel -->
        - Display description on hover


---- Create boss-characters file - instead just use one characters js
      --- Create objects for each boss character (litch, slime, beholder, redhat) that stores: