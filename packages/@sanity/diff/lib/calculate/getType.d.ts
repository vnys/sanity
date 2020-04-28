import { ValueType, StringDiff, Diff } from '../types';
export declare function getType(item: unknown): ValueType;
export declare function isStringDiff(thing: Diff): thing is StringDiff;
export declare function isNullish(thing: unknown): boolean;
