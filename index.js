'use strict';

const cma = require('cumulative-moving-average');
const Glicko2 = require('glicko2').Glicko2;
const forEach = require('lodash.foreach');
const isUndefined = require('lodash.isundefined');

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

  const means = {
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

  const glck = new Glicko2({ vol });
  const ac = glck.makePlayer(means.a.rating.value, means.a.rd.value);
  const bc = glck.makePlayer(means.b.rating.value, means.b.rd.value);

  /** @type {[any, any, number][]} */
  const matches = [];

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
  const means = {
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

  const ac = { rating: means.a.rating.value, rd: means.a.rd.value };
  const bc = { rating: means.b.rating.value, rd: means.b.rd.value };

  return [ac, bc];
}

module.exports = compositeOpponent;
module.exports.lite = compositeOpponentLite;
