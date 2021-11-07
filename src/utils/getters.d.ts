import {Attributes} from 'graphology-types';

export function createWeightGetter(
  name?: string
): (attributes: Attributes) => number;
