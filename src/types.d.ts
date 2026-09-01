declare module 'cumulative-moving-average' {
  interface CMA {
    push(value: number): void;
    value: number;
  }

  function cma(): CMA;
  export = cma;
}

declare module 'glicko2' {
  interface Player {
    getRating(): number;
    getRd(): number;
    getVol(): number;
  }

  interface Glicko2Options {
    vol?: number;
  }

  class Glicko2 {
    constructor(options?: Glicko2Options);
    makePlayer(rating?: number, rd?: number, vol?: number): Player;
  }

  export { Glicko2, Player };
}

declare module 'lodash.foreach' {
  function forEach<T>(
    collection: readonly T[],
    iteratee: (value: T, index: number) => void
  ): void;
  export = forEach;
}

declare module 'lodash.isundefined' {
  function isUndefined(value: unknown): value is undefined;
  export = isUndefined;
}
