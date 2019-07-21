/* @flow */

export const inOrder = (a: Object, b: Object): number => {
  if (a.gain >= b.gain) return 1
  else return -1
}

export const randomize = (a: Object, b: Object): number => 0.5 - Math.random()
