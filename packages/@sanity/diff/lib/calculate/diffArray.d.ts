import { ArrayDiff, Maybe, Path } from '../types';
export declare function diffArray<T = unknown>(fromValue: Maybe<T[]>, toValue: Maybe<T[]>, path?: Path): ArrayDiff;
