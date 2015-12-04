var cma = require('cumulative-moving-average');
var glicko = require('glicko2').Glicko2;
var forEach = require('lodash.foreach');
var isUndefined = require('lodash.isundefined');

function compositeOpponent(a, b, win, vol) {
  if (isUndefined(vol)) {
    vol = 0.06;
  }

  var means = {
    a: {
      rating: cma(),
      rd: cma()
    },
    b: {
      rating: cma(),
      rd: cma()
    }
  };

  forEach(a, function(player) {
    means.a.rating.push(player.getRating());
    means.a.rd.push(player.getRd());
  });

  forEach(b, function(player) {
    means.b.rating.push(player.getRating());
    means.b.rd.push(player.getRd());
  });

  var glck = new glicko({vol: vol});
  var ac = glck.makePlayer(means.a.rating.value, means.a.rd.value);
  var bc = glck.makePlayer(means.b.rating.value, means.b.rd.value);

  var matches = [];

  a.forEach(function(player) {
    matches.push([player, bc, win]);
  });
  b.forEach(function(player) {
    matches.push([ac, player, win]);
  });

  return matches;
}

module.exports = compositeOpponent;
