import { SanityObject, Path, ObjectDiff } from '../types';
export declare function diffObject(fromValue: SanityObject | null | undefined, toValue: SanityObject | null | undefined, path?: Path): ObjectDiff;
