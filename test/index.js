'use strict';

const test = require('tape');
const isFunction = require('lodash.isfunction');
const forEach = require('lodash.foreach');
const Glicko2 = require('glicko2').Glicko2;

const compositeOpponent = require('../');

test('exports a function', function(t) {
  t.plan(1);
  t.ok(isFunction(compositeOpponent));
});

test('default vol test', function(t) {
  t.plan(22);

  const r = new Glicko2();
  const a = [
    r.makePlayer(1069, 227),
    r.makePlayer(2415, 217),
    r.makePlayer(1817, 258),
    r.makePlayer(2412, 239),
    r.makePlayer(2446, 66)
  ];
  const b = [
    r.makePlayer(1036, 85),
    r.makePlayer(1338, 64),
    r.makePlayer(1138, 64),
    r.makePlayer(1079, 159),
    r.makePlayer(1942, 164)
  ];

  const matches = compositeOpponent(a, b, 0);
  t.ok(Array.isArray(matches));
  t.equal(matches.length, 10);

  forEach(matches.slice(0, 5), function(m, i) {
    t.equal(m[0].getRating(), a[i].getRating());
    t.equal(m[0].getRd(), a[i].getRd());
  });

  forEach(matches.slice(5, 10), function(m, i) {
    t.equal(m[1].getRating(), b[i].getRating());
    t.equal(m[1].getRd(), b[i].getRd());
  });
});

function makePlayer(rating, rd) {
  return { rating, rd };
}

test('lite', function(t) {
  t.plan(6);

  const a = [
    makePlayer(1069, 227),
    makePlayer(2415, 217),
    makePlayer(1817, 258),
    makePlayer(2412, 239),
    makePlayer(2446, 66)
  ];
  const b = [
    makePlayer(1036, 85),
    makePlayer(1338, 64),
    makePlayer(1138, 64),
    makePlayer(1079, 159),
    makePlayer(1942, 164)
  ];

  const opp = compositeOpponent.lite(a, b);
  t.ok(Array.isArray(opp));
  t.equal(opp.length, 2);
  t.equal(opp[0].rating, 2031.8);
  t.equal(opp[1].rating, 1306.6);
  t.equal(opp[0].rd, 201.4);
  t.equal(opp[1].rd, 107.2);
});
