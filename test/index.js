var compositeOpponent = require('../');
var test = require('tape');
var isArray = require('lodash.isarray');
var isFunction = require('lodash.isfunction');
var forEach = require('lodash.foreach');
var glicko2 = require('glicko2').Glicko2;

test('exports a function', function(t) {
  t.plan(1);
  t.ok(isFunction(compositeOpponent));
});

test('default vol test', function(t) {
  t.plan(22);

  var r = new glicko2();
  var a = [
    r.makePlayer(1069, 227),
    r.makePlayer(2415, 217),
    r.makePlayer(1817, 258),
    r.makePlayer(2412, 239),
    r.makePlayer(2446, 66)
  ];
  var b = [
    r.makePlayer(1036, 85),
    r.makePlayer(1338, 64),
    r.makePlayer(1138, 64),
    r.makePlayer(1079, 159),
    r.makePlayer(1942, 164)
  ];

  var matches = compositeOpponent(a, b, 0);
  t.ok(isArray(matches));
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
