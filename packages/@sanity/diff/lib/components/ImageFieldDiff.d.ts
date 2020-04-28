import { ObjectDiff } from '../types';
import { DiffComponent } from './types';
interface Reference {
    _ref?: string;
    _weak?: boolean;
}
interface Image {
    asset?: Reference;
    hotspot?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    crop?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
export declare const ImageFieldDiff: DiffComponent<ObjectDiff<Image>>;
export {};
