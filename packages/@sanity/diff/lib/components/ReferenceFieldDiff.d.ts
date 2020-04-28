import { ObjectDiff } from '../types';
import { DiffComponent } from './types';
interface Reference {
    _ref?: string;
    _weak?: boolean;
}
export declare const ReferenceFieldDiff: DiffComponent<ObjectDiff<Reference>>;
export {};
