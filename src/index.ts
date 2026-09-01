import cma from 'cumulative-moving-average';
import type { Player } from 'glicko2';
import { Glicko2 } from 'glicko2';
import forEach from 'lodash.foreach';
import isUndefined from 'lodash.isundefined';

/** A Glicko-2 player as created by the `glicko2` package. */
export interface Glicko2Player {
  /** Returns the player's rating. */
  getRating(): number;
  /** Returns the player's rating deviation. */
  getRd(): number;
}

/** A lightweight player representation for use with `glicko2-lite`. */
export interface PlayerLite {
  /** The player's rating. */
  rating: number;
  /** The player's rating deviation. */
  rd: number;
}

/**
 * Creates match pairings for two teams of Glicko-2 players using composite
 * opponents. Each player on each team is paired against a composite opponent
 * whose rating and rating deviation is the average of the opposing team's
 * players.
 *
 * @param a Players on team A.
 * @param b Players on team B.
 * @param win Match outcome score (1 = team A wins, 0 = team A loses, 0.5 = draw).
 * @param vol Volatility parameter for the composite player. Defaults to `0.06`.
 * @returns An array of match tuples `[playerA, playerB, score]` suitable for
 *   passing to a Glicko-2 ranking period.
 */
export function compositeOpponent(
  a: readonly Glicko2Player[],
  b: readonly Glicko2Player[],
  win: number,
  vol?: number
): [Glicko2Player, Glicko2Player, number][] {
  if (isUndefined(vol)) {
    vol = 0.06;
  }

  const means = {
    a: {
      rating: cma(),
      rd: cma(),
    },
    b: {
      rating: cma(),
      rd: cma(),
    },
  };

  forEach(a as Glicko2Player[], (player) => {
    means.a.rating.push(player.getRating());
    means.a.rd.push(player.getRd());
  });

  forEach(b as Glicko2Player[], (player) => {
    means.b.rating.push(player.getRating());
    means.b.rd.push(player.getRd());
  });

  const glck = new Glicko2({ vol });
  const ac: Player = glck.makePlayer(means.a.rating.value, means.a.rd.value);
  const bc: Player = glck.makePlayer(means.b.rating.value, means.b.rd.value);

  const matches: [Glicko2Player, Glicko2Player, number][] = [];

  for (const player of a) {
    matches.push([player, bc, win]);
  }
  for (const player of b) {
    matches.push([ac, player, win]);
  }

  return matches;
}

/**
 * Creates composite opponents for two teams of lightweight player objects.
 * Specifically for use with `glicko2-lite`.
 *
 * @param a Players on team A, each with `rating` and `rd` properties.
 * @param b Players on team B, each with `rating` and `rd` properties.
 * @returns A tuple of two composite players `[compositeA, compositeB]` where
 *   each composite's rating and rd is the mean of its team's values.
 */
export function compositeOpponentLite(
  a: readonly PlayerLite[],
  b: readonly PlayerLite[]
): [PlayerLite, PlayerLite] {
  const means = {
    a: {
      rating: cma(),
      rd: cma(),
    },
    b: {
      rating: cma(),
      rd: cma(),
    },
  };

  forEach(a as PlayerLite[], (player) => {
    means.a.rating.push(player.rating);
    means.a.rd.push(player.rd);
  });

  forEach(b as PlayerLite[], (player) => {
    means.b.rating.push(player.rating);
    means.b.rd.push(player.rd);
  });

  const ac: PlayerLite = {
    rating: means.a.rating.value,
    rd: means.a.rd.value,
  };
  const bc: PlayerLite = {
    rating: means.b.rating.value,
    rd: means.b.rd.value,
  };

  return [ac, bc];
}
