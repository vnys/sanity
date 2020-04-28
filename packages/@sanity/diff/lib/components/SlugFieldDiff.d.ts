import { DiffComponent } from './types';
import { ObjectDiff, Maybe } from '../types';
interface Slug {
    current: Maybe<string>;
}
export declare const SlugFieldDiff: DiffComponent<ObjectDiff<Slug>>;
export {};
