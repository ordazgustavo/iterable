export const double = (x: number) => x * 2;

export const enumerate = (item: number, i: number) => [i, item] as const;

export const isEven = (x: number) => x % 2 === 0;
