# glicko2-composite-opponent

Update Glicko-2 ratings for two teams of players by creating a composite player
whose rating and deviation is the average of a team's players and then having
the opponent team's players each win/lose a single match against the composite
player.

This procedure is described in [_Abstracting Glicko-2 for Team Games_][1].

   [1]: http://rhetoricstudios.com/downloads/AbstractingGlicko2ForTeamGames.pdf

## Example

``` javascript
var compositeOpponent = require('../');
var glicko2 = require('glicko2').Glicko2;

var r = new glicko2();
var a = [
  r.makePlayer(1100, 300),
  r.makePlayer(1200, 310),
  r.makePlayer(1300, 320)
];
var b = [
  r.makePlayer(1400, 110),
  r.makePlayer(1500, 120),
  r.makePlayer(1600, 130)
];

// team A defeats team B
var matches = compositeOpponent(a, b, 1);
matches.forEach(function(match) {
  console.log('%d±%d vs %d±%d', Math.round(match[0].getRating()),
                                Math.round(match[0].getRd()),
                                Math.round(match[1].getRating()),
                                Math.round(match[1].getRd()));
  // => 1100±300 vs 1500±120
  // => 1200±310 vs 1500±120
  // => 1300±320 vs 1500±120
  // => 1200±310 vs 1400±110
  // => 1200±310 vs 1500±120
  // => 1200±310 vs 1600±130
});

```

## Installation

``` bash
$ npm install glicko2-composite-opponent
```

## API

``` javascript
var compositeOpponent = require('glicko2-composite-opponent');
```

### `compositeOpponent(a, b, score, [vol])`

Given _Arrays_ `a` and `b`, each containing [`glicko2`][2] Players, returns an
_Array_ of matches wherein each player on each team is put against a composite
opponent made up of the average rating and rating deviation of the opposite
team. Each match will have a score of _Number_ `score`.

If you use a custom `vol` parameter you can pass it as a fourth argument. This
is only used for creating the composite player.

   [2]: https://github.com/mmai/glicko2js

### `compositeOpponent.lite(a, b)`

Specifically for use with [`glicko2-lite`][3].

Given _Arrays_ `a` and `b`, each containing _Objects_ with `rating` and `rd`
properties, returns the composite opponents as an _Array_. First element will be the composite player created from `a` and second element will be the composite
player created from `b`.

   [3]: https://github.com/KenanY/glicko2-lite
