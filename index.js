'use strict';

var cma = require('cumulative-moving-average');
var Glicko2 = require('glicko2').Glicko2;
var forEach = require('lodash.foreach');
var isUndefined = require('lodash.isundefined');

/**
 * @param {readonly unknown[]} a
 * @param {readonly unknown[]} b
 * @param {number} win
 * @param {number} [vol=0.06]
 * @returns {[any, any, number][]}
 */
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

  var glck = new Glicko2({ vol: vol });
  var ac = glck.makePlayer(means.a.rating.value, means.a.rd.value);
  var bc = glck.makePlayer(means.b.rating.value, means.b.rd.value);

  /** @type {[any, any, number][]} */
  var matches = [];

  a.forEach(function(player) {
    matches.push([player, bc, win]);
  });
  b.forEach(function(player) {
    matches.push([ac, player, win]);
  });

  return matches;
}

/**
 * @typedef {object} PlayerLite
 * @property {number} rating
 * @property {number} rd
 */

/**
 * @param {readonly PlayerLite[]} a
 * @param {readonly PlayerLite[]} b
 * @returns {[PlayerLite, PlayerLite]}
 */
function compositeOpponentLite(a, b) {
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
    means.a.rating.push(player.rating);
    means.a.rd.push(player.rd);
  });

  forEach(b, function(player) {
    means.b.rating.push(player.rating);
    means.b.rd.push(player.rd);
  });

  var ac = { rating: means.a.rating.value, rd: means.a.rd.value };
  var bc = { rating: means.b.rating.value, rd: means.b.rd.value };

  return [ac, bc];
}

module.exports = compositeOpponent;
module.exports.lite = compositeOpponentLite;
