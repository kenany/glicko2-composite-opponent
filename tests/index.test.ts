import { Glicko2 } from 'glicko2';
import {
  compositeOpponent,
  compositeOpponentLite,
} from 'glicko2-composite-opponent';
import { describe, expect, it } from 'vitest';

describe('compositeOpponent', () => {
  it('is a function', () => {
    expect(typeof compositeOpponent).toBe('function');
  });

  it('returns correct matches with default vol', () => {
    const r = new Glicko2();
    const a = [
      r.makePlayer(1069, 227),
      r.makePlayer(2415, 217),
      r.makePlayer(1817, 258),
      r.makePlayer(2412, 239),
      r.makePlayer(2446, 66),
    ];
    const b = [
      r.makePlayer(1036, 85),
      r.makePlayer(1338, 64),
      r.makePlayer(1138, 64),
      r.makePlayer(1079, 159),
      r.makePlayer(1942, 164),
    ];

    const matches = compositeOpponent(a, b, 0);
    expect(Array.isArray(matches)).toBe(true);
    expect(matches.length).toBe(10);

    for (let i = 0; i < 5; i++) {
      expect(matches[i][0].getRating()).toBe(a[i].getRating());
      expect(matches[i][0].getRd()).toBe(a[i].getRd());
    }

    for (let i = 0; i < 5; i++) {
      expect(matches[5 + i][1].getRating()).toBe(b[i].getRating());
      expect(matches[5 + i][1].getRd()).toBe(b[i].getRd());
    }
  });
});

describe('compositeOpponentLite', () => {
  function makePlayer(rating: number, rd: number) {
    return { rating, rd };
  }

  it('returns composite opponents', () => {
    const a = [
      makePlayer(1069, 227),
      makePlayer(2415, 217),
      makePlayer(1817, 258),
      makePlayer(2412, 239),
      makePlayer(2446, 66),
    ];
    const b = [
      makePlayer(1036, 85),
      makePlayer(1338, 64),
      makePlayer(1138, 64),
      makePlayer(1079, 159),
      makePlayer(1942, 164),
    ];

    const opp = compositeOpponentLite(a, b);
    expect(Array.isArray(opp)).toBe(true);
    expect(opp.length).toBe(2);
    expect(opp[0].rating).toBe(2031.8);
    expect(opp[1].rating).toBe(1306.6);
    expect(opp[0].rd).toBe(201.4);
    expect(opp[1].rd).toBe(107.2);
  });
});
