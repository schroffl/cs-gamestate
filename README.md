# CS:GO Game Integration (node.js) [![npm version](https://badge.fury.io/js/cs-gamestate.svg)](https://www.npmjs.com/package/cs-gamestate)
If you don't know what CS:GO Game State Integration is, I suggest you to read [this](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Game_State_Integration) article published by Valve in their wiki.

## Example I
```javascript
var CSGameState = require('../index.js');

// The events are being reffered to like objects
// in this case the function will be called whenever 'player.state.health' changes
CSGameState.on('player.state.health', function(health, data) {
    // If you need any other information (e.g. money) you can access it in the data object
    // In the case of the players money that would be 'data.player.state.money'
	console.log('Health of', data.player.name, 'has changed:', health);
    // OUTPUT: Health of Hansiiii has changed: 72
});
```

## Example II
```javascript
var CSGameState = require('../index.js');

CSGameState.on('round.bomb', function(bombState, data) {
	switch(bombState) {
        case 'planted':
            console.log(new Date(), 'The bomb has been planted');
            break;

        case 'defused':
            console.log(new Date(), 'The bomb has been defused');
            break;

        case 'exploded':
            console.log(new Date(), 'The bomb blew up');
            break;
    }
});
```
