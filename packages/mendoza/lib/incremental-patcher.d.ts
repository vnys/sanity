import { RawPatch } from './patch';
declare type Origin = any;
export declare type Value = {
    data?: unknown;
    content?: Content;
    origin: Origin;
};
export declare type Type = 'array' | 'string' | 'object' | 'number' | 'boolean' | 'null';
export declare type Content = ObjectContent | ArrayContent | StringContent;
export declare type ObjectContent = {
    type: 'object';
    fields: {
        [key: string]: Value;
    };
};
export declare type ArrayContent = {
    type: 'array';
    elements: Value[];
};
export declare type StringContent = {
    type: 'string';
    parts: StringPart[];
};
export declare type StringPart = {
    value: string;
    utf8size: number;
    uses: StringContent[];
    origin: Origin;
};
export declare function wrap(data: any, origin: Origin): Value;
export declare function unwrap(value: Value): any;
export declare function getType(value: Value): Type;
export declare function rebaseValue(left: Value, right: Value): Value;
export declare function applyPatch(left: Value, patch: RawPatch, origin: Origin): Value;
export {};
